import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hip-ngx-error',
  templateUrl: './ngx-error.component.html',
  styleUrls: ['./ngx-error.component.css']
})
export class NgxErrorComponent {
  @Input() label: string = 'Field';
  @Input() control: FormControl | null;

  isInvalidControl() {
    return (
      this.control &&
      this.control.invalid &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }
}
