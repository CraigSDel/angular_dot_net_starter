import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  public users: User[];
  userForm;

  constructor(private userService: UserService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string) {
    this.userForm = this.formBuilder.group({
      userId: undefined,
      firstName: undefined,
      lastName: undefined
    });
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers(this.baseUrl).subscribe(result => {
      this.users = result;
    }, error => console.error(error));
  }

  onSubmit(userData) {
    const user = new User();
    user.UserId = userData.userId;
    user.FirstName = userData.firstName;
    user.LastName = userData.lastName;
    this.userService.save(user).subscribe(data => {
      console.log('Saved User ' + data);
      this.userForm.reset();
    },
      error => {
        console.log(error);
        this.userForm.reset();
      }
    );
  }

  delete(user) {
    this.userService.delete(user).subscribe(result => {
      console.error(result);
    }, error => {
      console.error(error);
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
