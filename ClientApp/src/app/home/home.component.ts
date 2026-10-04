import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgFor],
  template: `
    <section class="mb-4">
      <h1>User Task Management</h1>
      <p class="lead">Organize users, track work, and group related tasks in one place.</p>
    </section>
    <div class="row g-3">
      <div class="col-md-4" *ngFor="let item of items">
        <a class="card h-100 text-decoration-none" [routerLink]="item.route">
          <div class="card-body"><h2 class="h5">{{ item.title }}</h2><p class="text-muted mb-0">{{ item.description }}</p></div>
        </a>
      </div>
    </div>
  `
})
export class HomeComponent {
  readonly items = [
    { title: 'Users', description: 'Manage the people assigned to work.', route: '/users' },
    { title: 'Tasks', description: 'Track deadlines, status, and ownership.', route: '/tasks' },
    { title: 'Task groups', description: 'Organize related tasks together.', route: '/task-groups' }
  ];
}
