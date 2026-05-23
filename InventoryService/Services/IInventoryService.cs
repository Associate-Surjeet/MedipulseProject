using InventoryService.DTOs;

namespace InventoryService.Services;

public interface IInventoryService
{
    // Items
    Task<IEnumerable<ItemResponse>> GetAllItemsAsync();
    Task<ItemResponse?> GetItemByIdAsync(int id);
    Task<ItemResponse> CreateItemAsync(CreateItemRequest request);
    Task<ItemResponse?> UpdateItemAsync(int id, UpdateItemRequest request);
    Task<bool> DeleteItemAsync(int id);

    // Inventory Positions
    Task<IEnumerable<PositionResponse>> GetAllPositionsAsync();
    Task<IEnumerable<PositionResponse>> GetPositionsByItemAsync(int itemId);
    Task<PositionResponse?> GetPositionByIdAsync(int id);
    Task<PositionResponse> CreatePositionAsync(CreatePositionRequest request);
    Task<PositionResponse?> UpdatePositionAsync(int id, UpdatePositionRequest request);
    Task<bool> DeletePositionAsync(int id);
}
