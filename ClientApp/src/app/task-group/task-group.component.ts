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
      taskGroupId: undefined,
      name: undefined,
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
      this.getTaskGroups();
    }, error => {
        console.error(error);
    });
  }

  edit(taskGroup) {
    this.taskGroupForm = this.formBuilder.group({
      taskGroupId: taskGroup.taskGroupId,
      name: taskGroup.name,
      userTasks: new FormControl(taskGroup.userTasks)
    });
  }

  onSubmit(taskGroupData) {
    const taskGroup = new TaskGroup();
    taskGroup.TaskGroupId = taskGroupData.taskGroupId;
    taskGroup.Name = taskGroupData.name;
    taskGroup.UserTasks = taskGroupData.userTasks;
    this.taskGroupService.save(taskGroup).subscribe(data => {
      this.taskGroupForm.reset();
      this.getTaskGroups();
    },
      error => {
        console.log(error);
        this.taskGroupForm.reset();
      }
    );
  }

  public CompareUserTask(Param1: UserTask, Param2: UserTask): boolean {
    return Param1 && Param2 ? Param1.UserTaskId === Param2.UserTaskId : false;
  }
}
