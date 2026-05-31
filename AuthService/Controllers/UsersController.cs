using System.Security.Claims;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Constants;
using Shared.Filters;

namespace AuthService.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;

    public UsersController(IAuthService authService)
    {
        _authService = authService;
    }

    // GET /api/users
    [HttpGet]
    [RoleAuthorize(Roles.Admin)]
    public async Task<IActionResult> GetAll()
    {
        var users = await _authService.GetAllUsersAsync();
        return Ok(users);
    }

    // GET /api/users/{id}
    [HttpGet("{id:int}")]
    [RoleAuthorize(Roles.Admin)]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _authService.GetUserByIdAsync(id);
        if (user == null) return NotFound(new { message = $"User {id} not found." });
        return Ok(user);
    }

    // PUT /api/users/{id}/role — Admin changes a user's clinical role
    [HttpPut("{id:int}/role")]
    [RoleAuthorize(Roles.Admin)]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest request)
    {
        var updated = await _authService.UpdateRoleAsync(id, request);
        if (!updated) return NotFound(new { message = $"User {id} not found." });
        return NoContent();
    }

    // DELETE /api/users/{id} — hard delete, matches monolith Admin.Delete logic
    [HttpDelete("{id:int}")]
    [RoleAuthorize(Roles.Admin)]
    public async Task<IActionResult> Delete(int id)
    {
        // Cannot delete your own account.
        // Try both mapped (ClaimTypes.NameIdentifier) and unmapped ("sub") claim names
        // to handle differences across .NET JWT handler versions.
        var rawId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;
        if (int.TryParse(rawId, out var currentUserId) && id == currentUserId)
            return BadRequest(new { message = "You cannot delete your own account." });

        var result = await _authService.DeleteUserAsync(id);
        if (!result) return NotFound(new { message = $"User {id} not found." });
        return NoContent();
    }
}
