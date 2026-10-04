import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UserTaskService } from './user-task.service';
import { TaskGroupService } from './task-group.service';

describe('REST services', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserTaskService, TaskGroupService, provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    TestBed.resetTestingModule();
  });

  it('maps task DTO ids and sends typed task references', () => {
    const service = TestBed.inject(UserTaskService);
    service.getAll().subscribe(tasks => expect(tasks[0].userTaskId).toBe(7));
    const request = http.expectOne('/api/v1/tasks');
    request.flush([{ id: 7, name: 'Plan', deadline: '2030-01-01T00:00:00Z', status: 'To-Do', userId: 2, taskGroupId: null }]);
  });

  it('maps task-group DTO ids and nested tasks', () => {
    const service = TestBed.inject(TaskGroupService);
    service.getAll('taskCount').subscribe(groups => {
      expect(groups[0].taskGroupId).toBe(4);
      expect(groups[0].userTasks[0].userTaskId).toBe(7);
    });
    const request = http.expectOne('/api/v1/task-groups?sort=taskCount');
    request.flush([{ id: 4, name: 'Planning', tasks: [{ id: 7, name: 'Plan', deadline: '2030-01-01T00:00:00Z', status: 'To-Do', userId: 2 }] }]);
  });
});
