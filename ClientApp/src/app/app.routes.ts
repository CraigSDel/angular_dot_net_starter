import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { UserTaskComponent } from './user-task/user-task.component';
import { TaskGroupComponent } from './task-group/task-group.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Dashboard' },
  { path: 'users', component: UserComponent, title: 'Users' },
  { path: 'tasks', component: UserTaskComponent, title: 'Tasks' },
  { path: 'task-groups', component: TaskGroupComponent, title: 'Task Groups' },
  { path: '**', redirectTo: '' }
];
