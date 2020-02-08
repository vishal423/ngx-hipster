import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';
import { MaterialModule } from '../material/material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [FormBuilder, MatSnackBar]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create login form controls with empty initial value and invalid state', () => {
    expect(component.username!.value).toEqual('');
    expect(component.password!.value).toEqual('');

    expect(component.username!.valid).toBeFalsy();
    expect(component.password!.valid).toBeFalsy();

    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should change login form state to valid after user enters the username and password', () => {
    component.username!.patchValue('test');
    component.password!.patchValue('test');

    fixture.detectChanges();
    expect(component.username!.valid).toBeTruthy();
    expect(component.password!.valid).toBeTruthy();
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should display an error message when the username control is dirty and invalid', () => {
    expect(fixture.debugElement.queryAll(By.css('mat-error')).length).toEqual(
      0
    );

    component.username!.patchValue('');
    component.username!.markAsDirty();
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toEqual(1);
    expect(errors[0].nativeElement.innerHTML.trim()).toEqual(
      'Username must contain a value'
    );
  });
});
