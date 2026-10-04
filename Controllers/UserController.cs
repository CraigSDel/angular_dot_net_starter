using Microsoft.AspNetCore.Mvc;
using my_new_app.Contracts;
using my_new_app.Service;

namespace my_new_app.Controllers;

[ApiController, Route("api/v1/users")]
public sealed class UserController(IUserService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetAll(CancellationToken cancellationToken) => Ok(await service.GetAllAsync(cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> Get(int id, CancellationToken cancellationToken) => (await service.GetAsync(id, cancellationToken)) is { } user ? Ok(user) : NotFound();

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserDto>> Update(int id, UpdateUserRequest request, CancellationToken cancellationToken) => (await service.UpdateAsync(id, request, cancellationToken)) is { } user ? Ok(user) : NotFound();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) => (await service.DeleteAsync(id, cancellationToken)) switch
    {
        DeleteResult.Deleted => NoContent(),
        DeleteResult.NotFound => NotFound(),
        _ => Conflict(new ProblemDetails { Title = "User is in use", Detail = "Remove the user's tasks before deleting the user." })
    };
}
