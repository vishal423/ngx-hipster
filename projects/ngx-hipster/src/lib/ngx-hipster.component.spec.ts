import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxHipsterComponent } from './ngx-hipster.component';

describe('NgxHipsterComponent', () => {
  let component: NgxHipsterComponent;
  let fixture: ComponentFixture<NgxHipsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxHipsterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxHipsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
