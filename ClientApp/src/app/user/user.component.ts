import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  public users: User[];
  userForm;

  constructor(private userService: UserService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string) {
    this.userForm = this.formBuilder.group({
      firstName: '',
      lastName: ''
    });
  }


  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers(this.baseUrl).subscribe(result => {
      this.users = result;
    }, error => console.error(error));
  }

  onSubmit(userData) {
    const user = new User;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
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
}
