import { Component, Inject, OnInit } from '@angular/core';
import { TaskGroup } from '../../shared/models/task-group';
import { TaskGroupService } from '../../shared/services/task-group.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { User } from '../../shared/models/user';
import { UserTaskService } from '../../shared/services/user-task.service';
import { UserTask } from '../../shared/models/user-task';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html'
})
export class TaskGroupComponent {
  public taskGroups: TaskGroup[];
  private userTasks: UserTask[];
  taskGroupForm;

  constructor(private taskGroupService: TaskGroupService, private userTaskService: UserTaskService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string) {
    this.getTaskGroups();
    this.getUserTasks();
    this.taskGroupForm = this.formBuilder.group({
      name: '',
      userTasks: new FormControl(this.userTasks)
    });
  }

  getUserTasks() {
    this.userTaskService.getUserTasks(this.baseUrl).subscribe(result => {
      this.userTasks = result;
    }, error => {
      console.error(error)
    });
  }

  getTaskGroups(): void {
    this.taskGroupService.getTaskGroupService(this.baseUrl).subscribe(result => {
      this.taskGroups = result;
    }, error => {
      console.error(error)
    });
  }

  delete(taskGroup) {
    this.taskGroupService.delete(taskGroup).subscribe(result => {
        console.error(result);
    }, error => {
        console.error(error);
    });
  }

  edit(taskGroup) {
    console.error(taskGroup);
  }

  onSubmit(taskGroupData) {
    const taskGroup = new TaskGroup;
    taskGroup.Name = taskGroupData.name;
    taskGroup.UserTasks = taskGroupData.userTasks;
    this.taskGroupService.save(taskGroup).subscribe(data => {
      console.log('Saved User ' + data);
      this.taskGroupForm.reset();
    },
      error => {
        console.log(error);
        this.taskGroupForm.reset();
      }
    );
  }
}
