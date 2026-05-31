using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Filters;

namespace AuthService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST /api/auth/login — public, no auth needed
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(result);
    }

    // POST /api/auth/register — public (Admin restricts this via role in production)
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            await _authService.RegisterAsync(request);
            return StatusCode(StatusCodes.Status201Created, new { message = "Account created successfully. Please wait for admin approval." });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "A user with this email already exists." });
        }
    }

    // GET /api/auth/me — requires any authenticated user
    // [JwtAuth] replaces [Authorize]: same check but returns consistent JSON 401
    [HttpGet("me")]
    [JwtAuth]
    public IActionResult GetMe()
    {
        return Ok(new
        {
            UserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
            Name   = User.Identity?.Name,
            Email  = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value,
            Role   = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
        });
    }
}
