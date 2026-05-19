using Microsoft.EntityFrameworkCore;
using ProcurementService.Data;
using ProcurementService.DTOs;
using ProcurementService.Models;

namespace ProcurementService.Services;

public class ProcurementServiceImpl : IProcurementService
{
    private readonly ProcurementDbContext _db;

    public ProcurementServiceImpl(ProcurementDbContext db) => _db = db;

    // ── Suppliers ─────────────────────────────────────────────────────────

    public async Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync()
        => await _db.Suppliers
            .OrderByDescending(s => s.SupplierId)
            .Select(s => ToSupplierDto(s))
            .ToListAsync();

    public async Task<SupplierDto?> GetSupplierByIdAsync(int id)
    {
        var s = await _db.Suppliers.FindAsync(id);
        return s == null ? null : ToSupplierDto(s);
    }

    public async Task<SupplierDto> CreateSupplierAsync(CreateSupplierRequest request)
    {
        var supplier = new Supplier
        {
            Name         = request.Name,
            SupplierType = request.SupplierType,
            Status       = request.Status
        };
        _db.Suppliers.Add(supplier);
        await _db.SaveChangesAsync();
        return ToSupplierDto(supplier);
    }

    public async Task<SupplierDto?> UpdateSupplierAsync(int id, UpdateSupplierRequest request)
    {
        var supplier = await _db.Suppliers.FindAsync(id);
        if (supplier == null) return null;

        supplier.Name         = request.Name;
        supplier.SupplierType = request.SupplierType;
        supplier.Status       = request.Status;

        await _db.SaveChangesAsync();
        return ToSupplierDto(supplier);
    }

    public async Task<bool> DeleteSupplierAsync(int id)
    {
        var supplier = await _db.Suppliers
            .Include(s => s.PurchaseOrders)
            .FirstOrDefaultAsync(s => s.SupplierId == id);

        if (supplier == null) return false;

        if (supplier.PurchaseOrders.Any())
            throw new InvalidOperationException(
                $"Supplier {id} cannot be deleted: it has {supplier.PurchaseOrders.Count} " +
                "associated purchase order(s). Remove or reassign those orders first.");

        _db.Suppliers.Remove(supplier);
        await _db.SaveChangesAsync();
        return true;
    }

    // ── PurchaseOrders ────────────────────────────────────────────────────

    public async Task<IEnumerable<PurchaseOrderDto>> GetAllPurchaseOrdersAsync()
        => await _db.PurchaseOrders
            .OrderByDescending(po => po.PoId)
            .Include(po => po.Supplier)
            .Include(po => po.Receipts)
            .Select(po => ToPurchaseOrderDto(po))
            .ToListAsync();

    public async Task<IEnumerable<PurchaseOrderDto>> GetPurchaseOrdersBySupplierAsync(int supplierId)
        => await _db.PurchaseOrders
            .Where(po => po.SupplierId == supplierId)
            .OrderByDescending(po => po.PoId)
            .Include(po => po.Supplier)
            .Include(po => po.Receipts)
            .Select(po => ToPurchaseOrderDto(po))
            .ToListAsync();

    public async Task<PurchaseOrderDto?> GetPurchaseOrderByIdAsync(int id)
    {
        var po = await _db.PurchaseOrders
            .Include(po => po.Supplier)
            .Include(po => po.Receipts)
            .FirstOrDefaultAsync(po => po.PoId == id);
        return po == null ? null : ToPurchaseOrderDto(po);
    }

    public async Task<PurchaseOrderDto> CreatePurchaseOrderAsync(CreatePurchaseOrderRequest request)
    {
        // Validate supplier exists in the same DB
        var supplierExists = await _db.Suppliers.AnyAsync(s => s.SupplierId == request.SupplierId);
        if (!supplierExists)
            throw new InvalidOperationException(
                $"Supplier with ID {request.SupplierId} does not exist.");

        var po = new PurchaseOrder
        {
            SupplierId           = request.SupplierId,
            OrderDate            = request.OrderDate,
            ExpectedDeliveryDate = request.ExpectedDeliveryDate,
            Status               = "Draft",
            Notes                = request.Notes
        };

        _db.PurchaseOrders.Add(po);
        await _db.SaveChangesAsync();

        await _db.Entry(po).Reference(p => p.Supplier).LoadAsync();
        return ToPurchaseOrderDto(po);
    }

    public async Task<PurchaseOrderDto?> UpdatePurchaseOrderAsync(int id, UpdatePurchaseOrderRequest request)
    {
        var po = await _db.PurchaseOrders
            .Include(p => p.Supplier)
            .Include(p => p.Receipts)
            .FirstOrDefaultAsync(p => p.PoId == id);

        if (po == null) return null;

        if (po.Status != "Draft")
            throw new InvalidOperationException(
                $"Purchase order {id} cannot be edited in '{po.Status}' status. Only Draft orders can be modified.");

        if (po.SupplierId != request.SupplierId)
        {
            var supplierExists = await _db.Suppliers.AnyAsync(s => s.SupplierId == request.SupplierId);
            if (!supplierExists)
                throw new InvalidOperationException(
                    $"Supplier with ID {request.SupplierId} does not exist.");
            po.SupplierId = request.SupplierId;
            await _db.Entry(po).Reference(p => p.Supplier).LoadAsync();
        }

        po.OrderDate            = request.OrderDate;
        po.ExpectedDeliveryDate = request.ExpectedDeliveryDate;
        po.Notes                = request.Notes;

        await _db.SaveChangesAsync();
        return ToPurchaseOrderDto(po);
    }

    public async Task<PurchaseOrderDto?> UpdatePoStatusAsync(int id, UpdatePoStatusRequest request)
    {
        var po = await _db.PurchaseOrders
            .Include(p => p.Supplier)
            .Include(p => p.Receipts)
            .FirstOrDefaultAsync(p => p.PoId == id);

        if (po == null) return null;

        if (!IsValidStatusTransition(po.Status, request.Status))
            throw new InvalidOperationException(
                $"Cannot transition from '{po.Status}' to '{request.Status}'. " +
                "Allowed: " + string.Join(", ", GetAllowedNextStatuses(po.Status)));

        po.Status = request.Status;
        await _db.SaveChangesAsync();
        return ToPurchaseOrderDto(po);
    }

    public async Task<bool> DeletePurchaseOrderAsync(int id)
    {
        var po = await _db.PurchaseOrders
            .Include(p => p.Receipts)
            .FirstOrDefaultAsync(p => p.PoId == id);

        if (po == null) return false;

        if (po.Status != "Draft" && po.Status != "Cancelled")
            throw new InvalidOperationException(
                $"Purchase order {id} cannot be deleted in '{po.Status}' status. Only Draft or Cancelled orders can be deleted.");

        _db.Receipts.RemoveRange(po.Receipts);
        _db.PurchaseOrders.Remove(po);
        await _db.SaveChangesAsync();
        return true;
    }

    // ── Receipts ──────────────────────────────────────────────────────────

    public async Task<IEnumerable<ReceiptDto>> GetAllReceiptsAsync()
        => await _db.Receipts
            .OrderByDescending(r => r.ReceiptId)
            .Include(r => r.PurchaseOrder).ThenInclude(po => po!.Supplier)
            .Select(r => ToReceiptDto(r))
            .ToListAsync();

    public async Task<IEnumerable<ReceiptDto>> GetReceiptsByPoAsync(int poId)
        => await _db.Receipts
            .Where(r => r.PoId == poId)
            .OrderByDescending(r => r.ReceiptId)
            .Include(r => r.PurchaseOrder).ThenInclude(po => po!.Supplier)
            .Select(r => ToReceiptDto(r))
            .ToListAsync();

    public async Task<ReceiptDto?> GetReceiptByIdAsync(int id)
    {
        var r = await _db.Receipts
            .Include(r => r.PurchaseOrder).ThenInclude(po => po!.Supplier)
            .FirstOrDefaultAsync(r => r.ReceiptId == id);
        return r == null ? null : ToReceiptDto(r);
    }

    public async Task<ReceiptDto> CreateReceiptAsync(CreateReceiptRequest request)
    {
        var po = await _db.PurchaseOrders
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.PoId == request.PoId);

        if (po == null)
            throw new InvalidOperationException($"Purchase order {request.PoId} does not exist.");

        if (po.Status != "Approved" && po.Status != "Shipped" && po.Status != "PartiallyReceived")
            throw new InvalidOperationException(
                $"Cannot create a receipt against PO {request.PoId} in '{po.Status}' status. " +
                "The PO must be Approved, Shipped, or PartiallyReceived.");

        var receipt = new Receipt
        {
            PoId             = request.PoId,
            SupplierLot      = request.SupplierLot,
            ReceivedDate     = request.ReceivedDate,
            ReceivedBy       = request.ReceivedBy,
            QualityStatus    = request.QualityStatus,
            QuantityReceived = request.QuantityReceived,
            Remarks          = request.Remarks
        };

        _db.Receipts.Add(receipt);

        if (po.Status == "Approved" || po.Status == "Shipped")
            po.Status = "PartiallyReceived";

        await _db.SaveChangesAsync();
        receipt.PurchaseOrder = po;
        return ToReceiptDto(receipt);
    }

    public async Task<ReceiptDto?> UpdateReceiptAsync(int id, UpdateReceiptRequest request)
    {
        var receipt = await _db.Receipts
            .Include(r => r.PurchaseOrder).ThenInclude(po => po!.Supplier)
            .FirstOrDefaultAsync(r => r.ReceiptId == id);

        if (receipt == null) return null;

        receipt.SupplierLot      = request.SupplierLot;
        receipt.ReceivedDate     = request.ReceivedDate;
        receipt.ReceivedBy       = request.ReceivedBy;
        receipt.QualityStatus    = request.QualityStatus;
        receipt.QuantityReceived = request.QuantityReceived;
        receipt.Remarks          = request.Remarks;

        await _db.SaveChangesAsync();
        return ToReceiptDto(receipt);
    }

    public async Task<bool> DeleteReceiptAsync(int id)
    {
        var receipt = await _db.Receipts.FindAsync(id);
        if (receipt == null) return false;

        _db.Receipts.Remove(receipt);
        await _db.SaveChangesAsync();
        return true;
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private static SupplierDto ToSupplierDto(Supplier s) => new()
    {
        SupplierId   = s.SupplierId,
        Name         = s.Name,
        SupplierType = s.SupplierType,
        Status       = s.Status
    };

    private static PurchaseOrderDto ToPurchaseOrderDto(PurchaseOrder po) => new()
    {
        PoId                 = po.PoId,
        SupplierId           = po.SupplierId,
        SupplierName         = po.Supplier?.Name ?? string.Empty,
        OrderDate            = po.OrderDate,
        ExpectedDeliveryDate = po.ExpectedDeliveryDate,
        Status               = po.Status,
        Notes                = po.Notes,
        ReceiptCount         = po.Receipts?.Count ?? 0
    };

    private static ReceiptDto ToReceiptDto(Receipt r) => new()
    {
        ReceiptId        = r.ReceiptId,
        PoId             = r.PoId,
        SupplierLot      = r.SupplierLot,
        ReceivedDate     = r.ReceivedDate,
        ReceivedBy       = r.ReceivedBy,
        QualityStatus    = r.QualityStatus,
        QuantityReceived = r.QuantityReceived,
        Remarks          = r.Remarks,
        SupplierName     = r.PurchaseOrder?.Supplier?.Name ?? string.Empty
    };

    private static bool IsValidStatusTransition(string current, string next)
    {
        if (next == "Cancelled") return current != "FullyReceived";
        return (current, next) switch
        {
            ("Draft",             "Submitted")         => true,
            ("Submitted",         "Approved")          => true,
            ("Submitted",         "Draft")             => true,
            ("Approved",          "Shipped")           => true,
            ("Shipped",           "PartiallyReceived") => true,
            ("PartiallyReceived", "FullyReceived")     => true,
            _ => false
        };
    }

    private static IEnumerable<string> GetAllowedNextStatuses(string current) =>
        current switch
        {
            "Draft"             => ["Submitted", "Cancelled"],
            "Submitted"         => ["Approved", "Draft", "Cancelled"],
            "Approved"          => ["Shipped", "Cancelled"],
            "Shipped"           => ["PartiallyReceived", "Cancelled"],
            "PartiallyReceived" => ["FullyReceived", "Cancelled"],
            _                   => []
        };
}
