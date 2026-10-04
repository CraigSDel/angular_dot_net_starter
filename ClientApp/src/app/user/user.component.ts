import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user',
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  public users: User[] = [];
  public error = '';
  public isLoading = false;
  readonly displayedColumns = ['userId', 'firstName', 'lastName', 'actions'];
  userForm;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private changeDetector: ChangeDetectorRef) {
    this.userForm = this.formBuilder.group({
      userId: undefined,
      firstName: undefined,
      lastName: undefined
    });
  }

  ngOnInit(): void { this.getUsers(); }

  getUsers(): void {
    this.error = '';
    this.isLoading = true;
    this.userService.getAll().subscribe(result => {
      this.users = result;
      this.isLoading = false;
      this.changeDetector.detectChanges();
    }, error => { this.isLoading = false; this.error = error.status === 409 ? 'This user cannot be changed while tasks reference it.' : 'Unable to load users.'; });
  }

  onSubmit(userData) {
    this.error = '';
    const user = new User();
    user.userId = userData.userId;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    const request = user.userId ? this.userService.update(user) : this.userService.save(user);
    request.subscribe(() => {
      this.userForm.reset();
      this.getUsers();
    },
      error => {
        this.error = error.status === 400 ? 'Enter a first and last name.' : 'Unable to save the user.';
        this.changeDetector.detectChanges();
      }
    );
  }

  clear() {
    this.userForm.reset();
  }

  delete(user) {
    this.userService.delete(user).subscribe(result => {
      this.getUsers();
    }, error => {
      this.error = error.status === 409 ? 'Remove this user’s tasks before deleting the user.' : 'Unable to delete the user.';
    });
  }

  edit(user: User): void {
    this.userForm = this.formBuilder.group({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName
    });
  }
}
