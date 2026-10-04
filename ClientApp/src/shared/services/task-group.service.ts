import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskGroup } from '../models/task-group';

type ApiTask = { id: number; name: string; deadline: string; status: string; userId: number; taskGroupId?: number };
type ApiGroup = { id: number; name: string; tasks?: ApiTask[] };

@Injectable({
  providedIn: 'root',
})
export class TaskGroupService {

  constructor(private http: HttpClient) { }

  public delete(taskGroup: TaskGroup): Observable<void> {
    return this.http.delete<void>(`/api/v1/task-groups/${taskGroup.taskGroupId}`);
  }

  public getAll(sort?: 'name' | 'taskCount'): Observable<TaskGroup[]> {
    return this.http.get<ApiGroup[]>('/api/v1/task-groups', { params: sort ? { sort } : {} }).pipe(
      map(groups => groups.map(group => this.mapGroup(group)))
    );
  }

  public getAllOrderByName(): Observable<TaskGroup[]> {
    return this.getAll('name');
  }

  public getAllOrderByNumberOfTasks(): Observable<TaskGroup[]> {
    return this.getAll('taskCount');
  }

  public save(taskGroup: TaskGroup): Observable<TaskGroup> {
    const request = { name: taskGroup.name, taskIds: (taskGroup.userTasks ?? []).map(task => task.userTaskId) };
    return taskGroup.taskGroupId
      ? this.http.put<ApiGroup>(`/api/v1/task-groups/${taskGroup.taskGroupId}`, request).pipe(map(group => this.mapGroup(group)))
      : this.http.post<ApiGroup>('/api/v1/task-groups', request).pipe(map(group => this.mapGroup(group)));
  }

  private mapGroup(group: ApiGroup): TaskGroup {
    return {
      taskGroupId: group.id,
      name: group.name,
      userTasks: (group.tasks ?? []).map(task => ({ userTaskId: task.id, name: task.name, deadline: task.deadline, status: task.status, userId: task.userId, taskGroupId: task.taskGroupId }))
    };
  }
}
