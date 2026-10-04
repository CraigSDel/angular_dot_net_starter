using Microsoft.AspNetCore.Mvc;
using my_new_app.Contracts;
using my_new_app.Service;

namespace my_new_app.Controllers;

[ApiController, Route("api/v1/tasks")]
public sealed class UserTaskController(IUserTaskService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserTaskDto>>> GetAll(CancellationToken cancellationToken) => Ok(await service.GetAllAsync(cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserTaskDto>> Get(int id, CancellationToken cancellationToken) => (await service.GetAsync(id, cancellationToken)) is { } task ? Ok(task) : NotFound();

    [HttpPost]
    public async Task<ActionResult<UserTaskDto>> Create(CreateUserTaskRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await service.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }
        catch (ArgumentException exception) { return BadRequest(new ProblemDetails { Title = "Invalid reference", Detail = exception.Message }); }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserTaskDto>> Update(int id, UpdateUserTaskRequest request, CancellationToken cancellationToken)
    {
        try
        {
            return (await service.UpdateAsync(id, request, cancellationToken)) is { } task ? Ok(task) : NotFound();
        }
        catch (ArgumentException exception) { return BadRequest(new ProblemDetails { Title = "Invalid reference", Detail = exception.Message }); }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) => (await service.DeleteAsync(id, cancellationToken)) == DeleteResult.Deleted ? NoContent() : NotFound();
}
