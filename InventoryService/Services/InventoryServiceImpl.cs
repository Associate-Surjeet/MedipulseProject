using InventoryService.Data;
using InventoryService.DTOs;
using InventoryService.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Services;

public class InventoryServiceImpl : IInventoryService
{
    private readonly InventoryDbContext _context;

    public InventoryServiceImpl(InventoryDbContext context)
    {
        _context = context;
    }

    // ── ITEMS ─────────────────────────────────────────────────────────────

    public async Task<IEnumerable<ItemResponse>> GetAllItemsAsync()
    {
        var items = await _context.Items
            .Include(i => i.Positions)   // load related positions so we can sum up TotalStock
            .ToListAsync();

        return items.Select(MapItemToResponse);
    }

    public async Task<ItemResponse?> GetItemByIdAsync(int id)
    {
        var item = await _context.Items
            .Include(i => i.Positions)
            .FirstOrDefaultAsync(i => i.ItemId == id);

        return item is null ? null : MapItemToResponse(item);
    }

    public async Task<ItemResponse> CreateItemAsync(CreateItemRequest request)
    {
        var item = new Item
        {
            ItemCode           = request.ItemCode,
            Name               = request.Name,
            Description        = request.Description,
            Category           = request.Category,
            Unit               = request.Unit,
            StorageRequirement = request.StorageRequirement,
            SafetyStock        = request.SafetyStock
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return MapItemToResponse(item);
    }

    public async Task<ItemResponse?> UpdateItemAsync(int id, UpdateItemRequest request)
    {
        var item = await _context.Items
            .Include(i => i.Positions)
            .FirstOrDefaultAsync(i => i.ItemId == id);

        if (item is null) return null;

        // Only update fields that were actually sent (not null)
        if (request.Name               is not null) item.Name               = request.Name;
        if (request.Description        is not null) item.Description        = request.Description;
        if (request.Category           is not null) item.Category           = request.Category;
        if (request.Unit               is not null) item.Unit               = request.Unit;
        if (request.StorageRequirement is not null) item.StorageRequirement = request.StorageRequirement;
        if (request.SafetyStock        is not null) item.SafetyStock        = request.SafetyStock.Value;
        if (request.IsActive           is not null) item.IsActive           = request.IsActive.Value;

        await _context.SaveChangesAsync();
        return MapItemToResponse(item);
    }

    public async Task<bool> DeleteItemAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item is null) return false;

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    // ── INVENTORY POSITIONS ───────────────────────────────────────────────

    public async Task<IEnumerable<PositionResponse>> GetAllPositionsAsync()
    {
        var positions = await _context.InventoryPositions
            .Include(p => p.Item)
            .OrderBy(p => p.ExpiryDate)   // FEFO: soonest expiry appears first
            .ToListAsync();

        return positions.Select(MapPositionToResponse);
    }

    public async Task<IEnumerable<PositionResponse>> GetPositionsByItemAsync(int itemId)
    {
        var positions = await _context.InventoryPositions
            .Include(p => p.Item)
            .Where(p => p.ItemId == itemId)
            .OrderBy(p => p.ExpiryDate)      // FEFO: consume soonest-expiring lot first
            .ThenBy(p => p.ReceivedDate)     // FIFO: if same expiry, consume oldest-received first
            .ToListAsync();

        return positions.Select(MapPositionToResponse);
    }

    public async Task<PositionResponse?> GetPositionByIdAsync(int id)
    {
        var position = await _context.InventoryPositions
            .Include(p => p.Item)
            .FirstOrDefaultAsync(p => p.PositionId == id);

        return position is null ? null : MapPositionToResponse(position);
    }

    public async Task<PositionResponse> CreatePositionAsync(CreatePositionRequest request)
    {
        var position = new InventoryPosition
        {
            ItemId        = request.ItemId,
            LotId         = request.LotId,
            ExpiryDate    = request.ExpiryDate,
            Quantity      = request.Quantity,
            FacilityId    = request.FacilityId,
            StorageZoneId = request.StorageZoneId,
            SafetyStock   = request.SafetyStock,
            ReceivedDate  = request.ReceivedDate ?? DateTime.UtcNow
        };

        _context.InventoryPositions.Add(position);
        await _context.SaveChangesAsync();

        // Reload with Item included so the response has ItemName/ItemCode
        await _context.Entry(position).Reference(p => p.Item).LoadAsync();

        return MapPositionToResponse(position);
    }

    public async Task<PositionResponse?> UpdatePositionAsync(int id, UpdatePositionRequest request)
    {
        var position = await _context.InventoryPositions
            .Include(p => p.Item)
            .FirstOrDefaultAsync(p => p.PositionId == id);

        if (position is null) return null;

        if (request.Quantity      is not null) position.Quantity      = request.Quantity.Value;
        if (request.FacilityId    is not null) position.FacilityId    = request.FacilityId.Value;
        if (request.StorageZoneId is not null) position.StorageZoneId = request.StorageZoneId.Value;
        if (request.SafetyStock   is not null) position.SafetyStock   = request.SafetyStock.Value;
        if (request.ExpiryDate    is not null) position.ExpiryDate    = request.ExpiryDate.Value;

        await _context.SaveChangesAsync();
        return MapPositionToResponse(position);
    }

    public async Task<bool> DeletePositionAsync(int id)
    {
        var position = await _context.InventoryPositions.FindAsync(id);
        if (position is null) return false;

        _context.InventoryPositions.Remove(position);
        await _context.SaveChangesAsync();
        return true;
    }

    // ── PRIVATE MAPPERS ───────────────────────────────────────────────────
    // Converts a Model (DB shape) → DTO (API shape)

    private static ItemResponse MapItemToResponse(Item item) => new()
    {
        ItemId             = item.ItemId,
        ItemCode           = item.ItemCode,
        Name               = item.Name,
        Description        = item.Description,
        Category           = item.Category,
        Unit               = item.Unit,
        StorageRequirement = item.StorageRequirement,
        SafetyStock        = item.SafetyStock,
        IsActive           = item.IsActive,
        CreatedAt          = item.CreatedAt,
        TotalStock         = item.Positions.Sum(p => p.Quantity)
    };

    private static PositionResponse MapPositionToResponse(InventoryPosition p) => new()
    {
        PositionId    = p.PositionId,
        ItemId        = p.ItemId,
        ItemName      = p.Item?.Name     ?? string.Empty,
        ItemCode      = p.Item?.ItemCode ?? string.Empty,
        LotId         = p.LotId,
        ExpiryDate    = p.ExpiryDate,
        Quantity      = p.Quantity,
        FacilityId    = p.FacilityId,
        StorageZoneId = p.StorageZoneId,
        SafetyStock   = p.SafetyStock,
        ReceivedDate  = p.ReceivedDate
    };
}
