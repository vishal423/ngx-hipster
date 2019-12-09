import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgxErrorComponent } from './ngx-error.component';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'hip-test-host',
  template: `
    <hip-ngx-error [control]="form.get('test')" label="Test"></hip-ngx-error>
  `
})
class HostStubComponent {
  form: FormGroup;
  @ViewChild(NgxErrorComponent, { static: true })
  public errorComponent: NgxErrorComponent;

  constructor(fb: FormBuilder) {
    this.form = fb.group({ test: fb.control('', [Validators.required]) });
  }
}

describe('NgxErrorComponent', () => {
  let component: NgxErrorComponent;
  let hostComponent: HostStubComponent;
  let fixture: ComponentFixture<HostStubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxErrorComponent, HostStubComponent],
      imports: [CommonModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostStubComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.errorComponent).toBeTruthy();
  });
});
