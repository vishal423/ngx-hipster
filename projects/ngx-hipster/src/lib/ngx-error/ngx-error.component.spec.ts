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
  form = new FormGroup({ test: new FormControl() });
  @ViewChild(NgxErrorComponent, { static: true })
  errorComponent: NgxErrorComponent;
}

describe('NgxErrorComponent', () => {
  let component: NgxErrorComponent;
  let hostComponent: HostStubComponent;
  let fixture: ComponentFixture<HostStubComponent>;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxErrorComponent, HostStubComponent],
      imports: [CommonModule, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostStubComponent);
    hostComponent = fixture.componentInstance;
    component = hostComponent.errorComponent;
    fb = fixture.debugElement.injector.get(FormBuilder);
    fixture.detectChanges();
  });

  it('should create an error component with no error message', () => {
    expect(component.control.valid).toBeTruthy();
  });

  it('should create an error component with required error message', () => {
    hostComponent.form = fb.group({
      test: fb.control('', [Validators.required])
    });
    fixture.detectChanges();
    expect(component.control.valid).toBeFalsy();
  });
});
