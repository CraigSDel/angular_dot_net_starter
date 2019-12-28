import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskGroup } from '../models/task-group';

@Injectable({
    providedIn: 'root',
})
export class TaskGroupService {

    constructor(private http: HttpClient) { }

    public delete(taskGroup: any) {
      return this.http.post<TaskGroup>('taskGroup/Delete', taskGroup);
    }

    public getTaskGroupService(baseUrl: string): Observable<TaskGroup[]> {
      return this.http.get<TaskGroup[]>(baseUrl + 'taskgroup');
    }

    public save(taskGroup: TaskGroup): Observable<TaskGroup> {
      return this.http.post<TaskGroup>('taskGroup', taskGroup);
    }
}
