using Microsoft.AspNetCore.Mvc;
using my_new_app.Contracts;
using my_new_app.Service;

namespace my_new_app.Controllers;

[ApiController, Route("api/v1/task-groups")]
public sealed class TaskGroupController(ITaskGroupService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TaskGroupDto>>> GetAll([FromQuery] string? sort, CancellationToken cancellationToken) => Ok(await service.GetAllAsync(sort, cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskGroupDto>> Get(int id, CancellationToken cancellationToken) => (await service.GetAsync(id, cancellationToken)) is { } group ? Ok(group) : NotFound();

    [HttpPost]
    public async Task<ActionResult<TaskGroupDto>> Create(CreateTaskGroupRequest request, CancellationToken cancellationToken)
    {
        var group = await service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = group.Id }, group);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskGroupDto>> Update(int id, UpdateTaskGroupRequest request, CancellationToken cancellationToken)
    {
        return (await service.UpdateAsync(id, request, cancellationToken)) is { } group ? Ok(group) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) => (await service.DeleteAsync(id, cancellationToken)) switch
    {
        DeleteResult.Deleted => NoContent(),
        DeleteResult.NotFound => NotFound(),
        _ => Conflict(new ProblemDetails { Title = "Task group is in use", Detail = "Remove the group's tasks before deleting the task group." })
    };
}
