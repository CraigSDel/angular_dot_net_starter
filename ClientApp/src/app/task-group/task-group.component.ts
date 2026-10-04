import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { TaskGroup } from '../../shared/models/task-group';
import { TaskGroupService } from '../../shared/services/task-group.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserTaskService } from '../../shared/services/user-task.service';
import { UserTask } from '../../shared/models/user-task';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-task-group',
  imports: [NgIf, NgFor, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatTableModule],
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.css']
})
export class TaskGroupComponent implements OnInit {
  public taskGroups: TaskGroup[] = [];
  public error = '';
  public userTasks: UserTask[] = [];
  public isLoading = false;
  public isLoadingTasks = false;
  readonly displayedColumns = ['taskGroupId', 'name', 'userTasks', 'actions'];
  taskGroupForm;

  constructor(private taskGroupService: TaskGroupService, private userTaskService: UserTaskService, private formBuilder: FormBuilder, private changeDetector: ChangeDetectorRef) {
    this.taskGroupForm = this.formBuilder.group({
      taskGroupId: undefined,
      name: undefined,
      userTasks: new FormControl<UserTask[]>([])
    });
  }

  ngOnInit(): void {
    this.getTaskGroups();
    this.getUserTasks();
  }

  getUserTasks() {
    this.isLoadingTasks = true;
    this.userTaskService.getAll().subscribe(result => {
      this.userTasks = result;
      this.isLoadingTasks = false;
      this.changeDetector.detectChanges();
    }, error => {
      this.isLoadingTasks = false;
      this.error = 'Unable to load tasks.';
    });
  }

  getTaskGroups(): void {
    this.isLoading = true;
    this.taskGroupService.getAll().subscribe(result => {
      this.taskGroups = result;
      this.isLoading = false;
      this.changeDetector.detectChanges();
    }, error => {
      this.isLoading = false;
      this.error = 'Unable to load task groups.';
    });
  }

  delete(taskGroup) {
    this.taskGroupService.delete(taskGroup).subscribe(result => {
      this.getTaskGroups();
    }, error => {
        this.error = error.status === 409 ? 'Remove the group’s tasks before deleting the group.' : 'Unable to delete the task group.';
    });
  }

  edit(taskGroup) {
    this.taskGroupForm = this.formBuilder.group({
      taskGroupId: taskGroup.taskGroupId,
      name: taskGroup.name,
      userTasks: new FormControl<UserTask[]>(taskGroup.userTasks)
    });
  }

  clear() {
    this.taskGroupForm.reset();
  }

  onSubmit(taskGroupData) {
    const taskGroup = new TaskGroup();
    taskGroup.taskGroupId = taskGroupData.taskGroupId;
    taskGroup.name = taskGroupData.name;
    taskGroup.userTasks = taskGroupData.userTasks;
    this.taskGroupService.save(taskGroup).subscribe(data => {
      this.taskGroupForm.reset();
      this.getTaskGroups();
      this.getUserTasks();
    },
      error => {
        this.error = error.status === 400 ? 'Select valid tasks for the group.' : 'Unable to save the task group.';
        this.taskGroupForm.reset();
      }
    );
  }

  public CompareUserTask(Param1: UserTask, Param2: UserTask): boolean {
    return Param1 && Param2 ? Param1.userTaskId === Param2.userTaskId : false;
  }
}
