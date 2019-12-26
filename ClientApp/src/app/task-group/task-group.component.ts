import { Component, Inject } from '@angular/core';
import { TaskGroup } from '../../shared/models/task-group';
import { TaskGroupService } from '../../shared/services/task-group.service';

@Component({
    selector: 'app-task-group',
    templateUrl: './task-group.component.html'
})
export class TaskGroupComponent {
  public taskGroups: TaskGroup[];

  constructor(private taskGroupService: TaskGroupService, @Inject('BASE_URL') private baseUrl: string) {

  }
  ngOnInit() {
    this.getTaskGroups();
  }

  getTaskGroups(): void {
    this.taskGroupService.getTaskGroupService(this.baseUrl).subscribe(result => {
      this.taskGroups = result;
    }, error => console.error(error));
  }
}
