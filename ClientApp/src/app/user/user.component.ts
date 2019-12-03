import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
   public users: User[];

    constructor(private userService: UserService, @Inject('BASE_URL') private baseUrl: string) {
        
    }
    ngOnInit() {
        this.getUsers();
    }

    getUsers():void {
        this.userService.getUsers(this.baseUrl).subscribe(result => {
            this.users = result;
        }, error => console.error(error));
    }
}
