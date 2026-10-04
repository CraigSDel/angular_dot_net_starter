import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { UserService } from './user.service';
import { User } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      http.verify();
    } finally {
      TestBed.resetTestingModule();
    }
  });

  it('gets users from the API', () => {
    const users = [{ id: 1, firstName: 'Ada', lastName: 'Lovelace' }];
    service.getAll().subscribe(result => expect(result).toEqual([{ userId: 1, firstName: 'Ada', lastName: 'Lovelace' }]));
    const request = http.expectOne('/api/v1/users');
    expect(request.request.method).toBe('GET');
    request.flush(users);
  });

  it('posts a user to the API', () => {
    const user = new User();
    user.firstName = 'Grace';
    user.lastName = 'Hopper';
    service.save(user).subscribe(result => expect(result).toEqual({ userId: 1, firstName: 'Grace', lastName: 'Hopper' }));
    const request = http.expectOne('/api/v1/users');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ firstName: 'Grace', lastName: 'Hopper' });
    request.flush({ id: 1, firstName: 'Grace', lastName: 'Hopper' });
  });
});
