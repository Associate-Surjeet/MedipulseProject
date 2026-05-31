using InventoryService.DTOs;

namespace InventoryService.Services;

public interface IInventoryService
{
    // Items
    Task<IEnumerable<ItemResponse>> GetAllItemsAsync();
    Task<ItemResponse?> GetItemByIdAsync(int id);
    Task<bool> CreateItemAsync(CreateItemRequest request);
    Task<bool> UpdateItemAsync(int id, UpdateItemRequest request);
    Task<bool> DeleteItemAsync(int id);

    // Inventory Positions
    Task<IEnumerable<PositionResponse>> GetAllPositionsAsync();
    Task<IEnumerable<PositionResponse>> GetPositionsByItemAsync(int itemId);
    Task<PositionResponse?> GetPositionByIdAsync(int id);
    Task<bool> CreatePositionAsync(CreatePositionRequest request);
    Task<bool> UpdatePositionAsync(int id, UpdatePositionRequest request);
    Task<bool> DeletePositionAsync(int id);
}
