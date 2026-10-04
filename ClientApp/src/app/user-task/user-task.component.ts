import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserTaskService } from '../../shared/services/user-task.service';
import { UserTask } from '../../shared/models/user-task';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-task',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './user-task.component.html',
  providers: [DatePipe]  
})
export class UserTaskComponent implements OnInit {
  public userTasks: UserTask[] = [];
  public users: User[] = [];
  public error = '';
  userTaskForm;

  statuses = ['To-Do', 'In-Progress', 'Done'];

  constructor(private userTaskService: UserTaskService, private userService: UserService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.userTaskForm = this.formBuilder.group({
      userTaskId: undefined,
      name: undefined,
      deadline: undefined,
      userId: undefined,
      status: undefined
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getUserTasks();
  }

  getUserTasks(): void {
    this.userTaskService.getAll().subscribe(result => {
      this.userTasks = result;
    }, error => { this.error = 'Unable to load tasks.'; console.error(error); });
  }

  getUsers(): void {
    this.userService.getAll().subscribe(result => {
      this.users = result;
    }, error => { this.error = 'Unable to load users.'; console.error(error); });
  }

  onSubmit(userData) {
    const userTask = new UserTask();
    userTask.userTaskId = userData.userTaskId;
    userTask.name = userData.name;
    userTask.userId = userData.userId;
    userTask.deadline = userData.deadline;
    userTask.status = userData.status;
    this.userTaskService.save(userTask).subscribe(data => {
      console.log('Saved User ' + data);
      this.userTaskForm.reset();
      this.getUsers();
      this.getUserTasks();
    },
      error => {
        this.error = error.status === 400 ? 'Check the selected user and task group.' : 'Unable to save the task.';
        console.log(error);
        this.userTaskForm.reset();
      }
    );
  }

  delete(userTask) {
    this.userTaskService.delete(userTask).subscribe(result => {
      this.getUserTasks();
    }, error => {
      this.error = error.status === 409 ? 'This task cannot be deleted while it is in a group.' : 'Unable to delete the task.';
    });
  }

  edit(userTask) {
    this.userTaskForm = this.formBuilder.group({
      userTaskId: userTask.userTaskId,
      name: userTask.name,
      deadline: this.datePipe.transform(new Date(userTask.deadline), 'yyyy-MM-dd'),
      userId: userTask.userId,
      status: userTask.status
    });
  }

  clear() {
    this.userTaskForm.reset();
  }

  public CompareUser(Param1: User, Param2: User): boolean {
    return Param1 && Param2 ? Param1.userId === Param2.userId : false;
  }
}
