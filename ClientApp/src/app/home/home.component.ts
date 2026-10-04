import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgFor, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly items = [
    { title: 'Users', description: 'Manage the people assigned to work.', route: '/users', icon: 'group' },
    { title: 'Tasks', description: 'Track deadlines, status, and ownership.', route: '/tasks', icon: 'checklist' },
    { title: 'Task groups', description: 'Organize related tasks together.', route: '/task-groups', icon: 'folder' }
  ];
}
