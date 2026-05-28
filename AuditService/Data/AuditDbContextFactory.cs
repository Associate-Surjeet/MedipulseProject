using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AuditService.Data;

// Used by EF Core migration tooling (Add-Migration, Update-Database).
// When the design-time tools cannot boot the full application service provider
// (e.g. a package conflict prevents the DI container from starting), they fall
// back to this factory to create the DbContext directly.
//
// This reads appsettings.json from the project directory at design time,
// bypassing all app startup code.
public class AuditDbContextFactory : IDesignTimeDbContextFactory<AuditDbContext>
{
    public AuditDbContext CreateDbContext(string[] args)
    {
        var config = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var options = new DbContextOptionsBuilder<AuditDbContext>()
            .UseSqlServer(config.GetConnectionString("DefaultConnection"))
            .Options;

        return new AuditDbContext(options);
    }
}
