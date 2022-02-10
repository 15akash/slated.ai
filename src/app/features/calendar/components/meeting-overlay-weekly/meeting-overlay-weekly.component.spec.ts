import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingOverlayWeeklyComponent } from './meeting-overlay-weekly.component';

describe('MeetingOverlayWeeklyComponent', () => {
  let component: MeetingOverlayWeeklyComponent;
  let fixture: ComponentFixture<MeetingOverlayWeeklyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingOverlayWeeklyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingOverlayWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
