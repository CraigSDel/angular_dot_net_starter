import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserTaskService } from '../../shared/services/user-task.service';
import { UserTask } from '../../shared/models/user-task';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html'
})
export class UserTaskComponent {
  public userTasks: UserTask[];
  public users: User[];
  userTaskForm;

  constructor(private userTaskService: UserTaskService, private userService: UserService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string) {
    this.userTaskForm = this.formBuilder.group({
      name: undefined,
      deadline: undefined,
      user: undefined,
      status: undefined
    });
    this.getUsers();
    this.getUserTasks();
  }

  getUserTasks(): void {
    this.userTaskService.getUserTasks(this.baseUrl).subscribe(result => {
      this.userTasks = result;
    }, error => console.error(error));
  }

  getUsers(): void {
    this.userService.getUsers(this.baseUrl).subscribe(result => {
      this.users = result;
    }, error => console.error(error));
  }

  onSubmit(userData) {
    const userTask = new UserTask;
    userTask.Name = userData.name;
    userTask.User = userData.user;
    this.userTaskService.save(userTask).subscribe(data => {
      console.log('Saved User ' + data);
      this.userTaskForm.reset();
    },
      error => {
        console.log(error);
        this.userTaskForm.reset();
      }
    );
  }

  delete(userTask) {
    this.userTaskService.delete(userTask).subscribe(result => {
      console.error(result);
    }, error => {
      console.error(error);
    });
  }

  edit(userTask) {
    console.error(userTask);
  }
}
