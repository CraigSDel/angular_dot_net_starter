import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<User[]> {
    return this.http.get<Array<{ id: number; firstName: string; lastName: string }>>('/api/v1/users').pipe(
      map(users => users.map(user => ({ userId: user.id, firstName: user.firstName, lastName: user.lastName })))
    );
  }

  public save(user: User): Observable<User> {
    return this.http.post<{ id: number; firstName: string; lastName: string }>('/api/v1/users', { firstName: user.firstName, lastName: user.lastName }).pipe(
      map(saved => ({ userId: saved.id, firstName: saved.firstName, lastName: saved.lastName }))
    );
  }

  public update(user: User): Observable<User> {
    return this.http.put<{ id: number; firstName: string; lastName: string }>(`/api/v1/users/${user.userId}`, { firstName: user.firstName, lastName: user.lastName }).pipe(
      map(saved => ({ userId: saved.id, firstName: saved.firstName, lastName: saved.lastName }))
    );
  }

  public delete(user: User): Observable<void> {
    return this.http.delete<void>(`/api/v1/users/${user.userId}`);
  }
}
