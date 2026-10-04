import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUser } from '../api-types';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<User[]> {
    return this.http.get<ApiUser[]>('/api/v1/users').pipe(
      map(users => users.map(UserService.toModel))
    );
  }

  public save(user: User): Observable<User> {
    return this.http.post<ApiUser>('/api/v1/users', { firstName: user.firstName, lastName: user.lastName }).pipe(
      map(UserService.toModel)
    );
  }

  public update(user: User): Observable<User> {
    return this.http.put<ApiUser>(`/api/v1/users/${user.userId}`, { firstName: user.firstName, lastName: user.lastName }).pipe(
      map(UserService.toModel)
    );
  }

  public delete(user: User): Observable<void> {
    return this.http.delete<void>(`/api/v1/users/${user.userId}`);
  }

  private static toModel(user: ApiUser): User {
    return { userId: user.id, firstName: user.firstName, lastName: user.lastName };
  }
}
