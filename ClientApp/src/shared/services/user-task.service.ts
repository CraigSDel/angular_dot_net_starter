import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { UserTask } from '../models/user-task';

@Injectable({
    providedIn: 'root',
})
export class UserTaskService {

  constructor(private http: HttpClient) {}

  public getUserTasks(baseUrl: string): Observable<UserTask[]>{
    return this.http.get<UserTask[]>(baseUrl + 'userTask');
  }

  public save(user: UserTask): Observable<UserTask> {
    return this.http.post<UserTask>('userTask', user);
  }
}
