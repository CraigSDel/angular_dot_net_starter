import { Component, Inject } from '@angular/core';
import { TaskGroup } from '../../shared/models/task-group';
import { TaskGroupService } from '../../shared/services/task-group.service';
import { FormBuilder } from '@angular/forms';
import { User } from '../../shared/models/user';

@Component({
    selector: 'app-task-group',
    templateUrl: './task-group.component.html'
})
export class TaskGroupComponent {
  public taskGroups: TaskGroup[];
  userForm;

  constructor(private taskGroupService: TaskGroupService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string) {
    this.userForm = this.formBuilder.group({
      firstName: '',
      lastName: ''
    });
  }
  ngOnInit() {
    this.getTaskGroups();
  }

  getTaskGroups(): void {
    this.taskGroupService.getTaskGroupService(this.baseUrl).subscribe(result => {
      this.taskGroups = result;
    }, error => console.error(error));
  }

  onSubmit(userData) {
    const user = new TaskGroup;
    user.name = userData.firstName;
    user.userTasks = userData.lastName;
    this.taskGroupService.save(user).subscribe(data => {
      console.log('Saved User ' + data);
      this.userForm.reset();
    },
      error => {
        console.log(error);
        this.userForm.reset();
      }
    );
  }
}
