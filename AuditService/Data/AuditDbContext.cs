using AuditService.Models;
using Microsoft.EntityFrameworkCore;

namespace AuditService.Data;

// Connects to MedipulseAudit — a SEPARATE database from MedipulseMain.
// All other services use MedipulseMain. AuditService is isolated so audit
// records are never co-mingled with operational data and cannot be wiped
// by operational migrations.
public class AuditDbContext : DbContext
{
    public AuditDbContext(DbContextOptions<AuditDbContext> options) : base(options) { }

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLog");
            entity.HasKey(e => e.AuditLogId);
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.UserName).HasMaxLength(150);
            entity.Property(e => e.UserRole).HasMaxLength(100);
            entity.Property(e => e.HttpMethod).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Endpoint).IsRequired().HasMaxLength(500);
            entity.Property(e => e.EntityType).HasMaxLength(100);
            entity.Property(e => e.EntityId).HasMaxLength(100);
            entity.Property(e => e.ServiceName).HasMaxLength(100);
            entity.Property(e => e.Timestamp).IsRequired().HasColumnType("datetime2");
            entity.Property(e => e.Details).HasMaxLength(2000);

            // Indexes for common query patterns
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.UserRole);
            entity.HasIndex(e => e.EntityType);
            entity.HasIndex(e => e.ServiceName);
        });
    }
}
