import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html'
})
export class UserTaskComponent implements OnInit {
  public users: User[];
  userTaskForm;

  constructor(private userService: UserService, private formBuilder: FormBuilder, @Inject('BASE_URL') private baseUrl: string) {
    this.userTaskForm = this.formBuilder.group({
      name: undefined,
      deadline: undefined,
      user: undefined,
      status: undefined
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
      this.userTaskForm.reset();
    },
      error => {
        console.log(error);
        this.userTaskForm.reset();
      }
    );
  }
}
