import { Component, Inject } from '@angular/core';
import { TaskGroupService } from '../../shared/services/task-group.service';
import { UserTaskService } from '../../shared/services/user-task.service';
import { UserTask } from '../../shared/models/user-task';
import { TaskGroup } from '../../shared/models/task-group';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public taskGroups: TaskGroup[];
  public userTasks: UserTask[];
  taskGroupForm;

  constructor(private taskGroupService: TaskGroupService, private userTaskService: UserTaskService, @Inject('BASE_URL') private baseUrl: string, private router: Router) {
    this.getTaskGroups();
    this.getUserTasks();
  }

  getUserTasks() {
    this.userTaskService.getAll(this.baseUrl).subscribe(result => {
      this.userTasks = result;
    }, error => {
      console.error(error)
    });
  }

  getTaskGroups(): void {
    this.taskGroupService.getAll(this.baseUrl).subscribe(result => {
      this.taskGroups = result;
    }, error => {
      console.error(error)
    });
  }

  orderByName() {
    this.taskGroupService.getAllOrderByName(this.baseUrl).subscribe(result => {
      this.taskGroups = result;
    }, error => {
      console.error(error)
    });
  }

  orderByTaskCount() {
    this.taskGroupService.getAllOrderByNumberOfTasks(this.baseUrl).subscribe(result => {
      this.taskGroups = result;
    }, error => {
      console.error(error)
    });
  }

  edit() {
    this.router.navigate(['/edit']);
  }
}
