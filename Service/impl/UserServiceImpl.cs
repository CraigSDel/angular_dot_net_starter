using Microsoft.EntityFrameworkCore;
using my_new_app.Contracts;
using my_new_app.Model;

namespace my_new_app.Service;

public sealed class UserServiceImpl(UserDataContext context) : IUserService
{
    public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken) =>
        await context.Users.AsNoTracking().OrderBy(user => user.LastName).ThenBy(user => user.FirstName)
            .Select(user => new UserDto(user.UserId, user.FirstName, user.LastName)).ToListAsync(cancellationToken);

    public async Task<UserDto?> GetAsync(int id, CancellationToken cancellationToken) =>
        await context.Users.AsNoTracking().Where(user => user.UserId == id)
            .Select(user => new UserDto(user.UserId, user.FirstName, user.LastName)).SingleOrDefaultAsync(cancellationToken);

    public async Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var user = new User { FirstName = request.FirstName.Trim(), LastName = request.LastName.Trim() };
        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);
        return new UserDto(user.UserId, user.FirstName, user.LastName);
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await context.Users.SingleOrDefaultAsync(item => item.UserId == id, cancellationToken);
        if (user is null) return null;
        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        await context.SaveChangesAsync(cancellationToken);
        return new UserDto(user.UserId, user.FirstName, user.LastName);
    }

    public async Task<DeleteResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var user = await context.Users.Include(item => item.UserTasks).SingleOrDefaultAsync(item => item.UserId == id, cancellationToken);
        if (user is null) return DeleteResult.NotFound;
        if (user.UserTasks.Count != 0) return DeleteResult.Conflict;
        context.Users.Remove(user);
        await context.SaveChangesAsync(cancellationToken);
        return DeleteResult.Deleted;
    }
}
