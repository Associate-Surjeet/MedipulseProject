using LogisticsService.Data;
using LogisticsService.Services;
using Microsoft.EntityFrameworkCore;
using Shared.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ── SHARED INFRASTRUCTURE ─────────────────────────────────────────────────
builder.Services.AddMediPulseControllers();
builder.Services.AddMediPulseSwagger("Logistics Service");
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddMediPulseCors();

// ── SERVICE-SPECIFIC REGISTRATIONS ────────────────────────────────────────
builder.Services.AddDbContext<LogisticsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ILogisticsService, LogisticsServiceImpl>();

// ── BUILD & PIPELINE ──────────────────────────────────────────────────────
var app = builder.Build();

// Auto-create / migrate database on startup
using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<LogisticsDbContext>().Database.Migrate();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMediPulseMiddleware();
app.MapControllers();

app.Run();
