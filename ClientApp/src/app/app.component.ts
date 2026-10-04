import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent],
  template: '<app-nav-menu></app-nav-menu><main class="container py-4"><router-outlet></router-outlet></main>'
})
export class AppComponent {
  title = 'app';
}
