import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './user.component.html'
})
export class UserComponent {
  public users: User[];
  public error = '';
  userForm;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      userId: undefined,
      firstName: undefined,
      lastName: undefined
    });
    this.getUsers();
  }

  getUsers(): void {
    this.error = '';
    this.userService.getAll().subscribe(result => {
      this.users = result;
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

  edit(userTask) {
    this.userForm = this.formBuilder.group({
      userId: userTask.userId,
      firstName: userTask.firstName,
      lastName: userTask.lastName
    });
  }
}
