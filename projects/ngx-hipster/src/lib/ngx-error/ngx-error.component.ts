import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hip-ngx-error',
  templateUrl: './ngx-error.component.html',
  styleUrls: ['./ngx-error.component.css']
})
export class NgxErrorComponent {
  @Input() label: string;
  @Input() control: FormControl;

  isInvalidControl() {
    return (
      this.control.invalid &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }
}
