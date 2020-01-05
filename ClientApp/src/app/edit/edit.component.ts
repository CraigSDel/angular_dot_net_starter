import { Component } from '@angular/core';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
/** edit component*/
export class EditComponent {
    /** edit ctor */
    constructor() {

  }

  refresh() {
    location.reload();
  }
}
