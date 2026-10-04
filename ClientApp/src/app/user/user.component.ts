import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  public users: User[] = [];
  public error = '';
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
    this.userService.getAll().subscribe(result => {
      this.users = result;
      this.changeDetector.detectChanges();
    }, error => { this.error = error.status === 409 ? 'This user cannot be changed while tasks reference it.' : 'Unable to load users.'; });
  }

  onSubmit(userData) {
    const user = new User();
    user.userId = userData.userId;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    const request = user.userId ? this.userService.update(user) : this.userService.save(user);
    request.subscribe(() => {
      this.userForm.reset();
      this.getUsers();
    },
      () => {
        this.userForm.reset();
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
