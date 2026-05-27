using InventoryService.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

    // Each DbSet = one table in the database
    public DbSet<Item> Items { get; set; }
    public DbSet<InventoryPosition> InventoryPositions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ItemCode must be unique — no two items can share the same code
        modelBuilder.Entity<Item>()
            .HasIndex(i => i.ItemCode)
            .IsUnique();

        // One Item has many InventoryPositions
        // If an Item is deleted, all its positions are deleted too (cascade)
        modelBuilder.Entity<InventoryPosition>()
            .HasOne(p => p.Item)
            .WithMany(i => i.Positions)
            .HasForeignKey(p => p.ItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
