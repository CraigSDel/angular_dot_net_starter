import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private http: HttpClient) {}

    public getUsers(baseUrl: string): Observable<User[]>{
        return this.http.get<User[]>(baseUrl + 'user');
    }
}
