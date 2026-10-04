import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTask } from '../models/user-task';
import { ApiTask } from '../api-types';

@Injectable({
    providedIn: 'root',
})
export class UserTaskService {

  constructor(private http: HttpClient) {}

  public getAll(): Observable<UserTask[]>{
    return this.http.get<ApiTask[]>('/api/v1/tasks').pipe(
      map(tasks => tasks.map(UserTaskService.toModel))
    );
  }

  public save(user: UserTask): Observable<UserTask> {
    const request = { name: user.name, deadline: user.deadline, status: user.status, userId: user.userId, taskGroupId: user.taskGroupId };
    return user.userTaskId
      ? this.http.put<ApiTask>(`/api/v1/tasks/${user.userTaskId}`, request).pipe(map(UserTaskService.toModel))
      : this.http.post<ApiTask>('/api/v1/tasks', request).pipe(map(UserTaskService.toModel));
  }

  public delete(userTask: UserTask): Observable<void> {
    return this.http.delete<void>(`/api/v1/tasks/${userTask.userTaskId}`);
  }

  private static toModel(task: ApiTask): UserTask {
    return { userTaskId: task.id, name: task.name, deadline: task.deadline, status: task.status, userId: task.userId, taskGroupId: task.taskGroupId };
  }
}
