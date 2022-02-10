import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingOverlayMonthlyComponent } from './meeting-overlay-monthly.component';

describe('MeetingOverlayMonthlyComponent', () => {
  let component: MeetingOverlayMonthlyComponent;
  let fixture: ComponentFixture<MeetingOverlayMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingOverlayMonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingOverlayMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
