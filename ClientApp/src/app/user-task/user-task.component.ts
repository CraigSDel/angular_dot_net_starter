import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserTaskService } from '../../shared/services/user-task.service';
import { UserTask } from '../../shared/models/user-task';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  providers: [DatePipe]  
})
export class UserTaskComponent {
  public userTasks: UserTask[];
  public users: User[];
  userTaskForm;

  statuses = ['To-Do', 'In-Progress', 'Done'];

  constructor(private userTaskService: UserTaskService, private userService: UserService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string, private datePipe: DatePipe) {
    this.userTaskForm = this.formBuilder.group({
      userTaskId: undefined,
      name: undefined,
      deadline: undefined,
      user: undefined,
      status: undefined
    });
    this.getUsers();
    this.getUserTasks();
  }

  getUserTasks(): void {
    this.userTaskService.getAll(this.baseUrl).subscribe(result => {
      this.userTasks = result;
    }, error => console.error(error));
  }

  getUsers(): void {
    this.userService.getAll(this.baseUrl).subscribe(result => {
      this.users = result;
    }, error => console.error(error));
  }

  onSubmit(userData) {
    const userTask = new UserTask();
    userTask.UserTaskId = userData.userTaskId;
    userTask.Name = userData.name;
    userTask.User = userData.user;
    userTask.Deadline = userData.deadline;
    userTask.Status = userData.status;
    this.userTaskService.save(userTask).subscribe(data => {
      console.log('Saved User ' + data);
      this.userTaskForm.reset();
      this.getUserTasks();
    },
      error => {
        console.log(error);
        this.userTaskForm.reset();
      }
    );
  }

  delete(userTask) {
    this.userTaskService.delete(userTask).subscribe(result => {
      this.getUserTasks();
    }, error => {
      console.error(error);
    });
  }

  edit(userTask) {
    this.userTaskForm = this.formBuilder.group({
      userTaskId: userTask.userTaskId,
      name: userTask.name,
      deadline: this.datePipe.transform(new Date(userTask.deadline), 'yyyy-MM-dd'),
      user: userTask.user,
      status: userTask.status
    });
  }

  clear() {
    this.userTaskForm.reset();
  }

  public CompareUser(Param1: User, Param2: User): boolean {
    return Param1 && Param2 ? Param1.UserId === Param2.UserId : false;
  }
}
