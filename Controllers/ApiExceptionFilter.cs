using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using my_new_app.Service;

namespace my_new_app.Controllers;

public sealed class ApiExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is not InvalidReferenceException exception) return;

        context.Result = new BadRequestObjectResult(new ProblemDetails
        {
            Title = "Invalid reference",
            Detail = exception.Message,
            Status = StatusCodes.Status400BadRequest
        });
        context.ExceptionHandled = true;
    }
}
