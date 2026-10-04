import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTask } from '../models/user-task';

@Injectable({
    providedIn: 'root',
})
export class UserTaskService {

  constructor(private http: HttpClient) {}

  public getAll(): Observable<UserTask[]>{
    return this.http.get<Array<{ id: number; name: string; deadline: string; status: string; userId: number; taskGroupId?: number }>>('/api/v1/tasks').pipe(
      map(tasks => tasks.map(task => ({ userTaskId: task.id, name: task.name, deadline: task.deadline, status: task.status, userId: task.userId, taskGroupId: task.taskGroupId })))
    );
  }

  public save(user: UserTask): Observable<UserTask> {
    const request = { name: user.name, deadline: user.deadline, status: user.status, userId: user.userId, taskGroupId: user.taskGroupId };
    type ApiTask = { id: number; name: string; deadline: string; status: string; userId: number; taskGroupId?: number };
    const response = (task: ApiTask): UserTask => ({ userTaskId: task.id, name: task.name, deadline: task.deadline, status: task.status, userId: task.userId, taskGroupId: task.taskGroupId });
    return user.userTaskId
      ? this.http.put<ApiTask>(`/api/v1/tasks/${user.userTaskId}`, request).pipe(map(response))
      : this.http.post<ApiTask>('/api/v1/tasks', request).pipe(map(response));
  }

  public delete(userTask: UserTask): Observable<void> {
    return this.http.delete<void>(`/api/v1/tasks/${userTask.userTaskId}`);
  }
}
