import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MaterialModule } from 'src/app/material/material.module';
import { MovieDeleteComponent } from './movie-delete.component';

describe('MovieDeleteComponent', () => {
  let component: MovieDeleteComponent;
  let fixture: ComponentFixture<MovieDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovieDeleteComponent],
      imports: [NoopAnimationsModule, MaterialModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
