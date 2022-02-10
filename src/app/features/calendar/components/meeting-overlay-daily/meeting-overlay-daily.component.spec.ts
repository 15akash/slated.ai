import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingOverlayDailyComponent } from './meeting-overlay-daily.component';

describe('MeetingOverlayDailyComponent', () => {
  let component: MeetingOverlayDailyComponent;
  let fixture: ComponentFixture<MeetingOverlayDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingOverlayDailyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingOverlayDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
