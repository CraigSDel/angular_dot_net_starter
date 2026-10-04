import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = false;
  isMobile = false;
  private breakpointSubscription?: Subscription;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver.observe('(max-width: 767px)').subscribe(state => {
      this.isMobile = state.matches;
      this.isExpanded = !this.isMobile;
    });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  collapse() {
    if (this.isMobile) this.sidenav?.close();
  }

  toggle() {
    this.sidenav?.toggle();
  }
}
