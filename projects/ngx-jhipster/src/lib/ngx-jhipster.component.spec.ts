import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJhipsterComponent } from './ngx-jhipster.component';

describe('NgxJhipsterComponent', () => {
  let component: NgxJhipsterComponent;
  let fixture: ComponentFixture<NgxJhipsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxJhipsterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxJhipsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
