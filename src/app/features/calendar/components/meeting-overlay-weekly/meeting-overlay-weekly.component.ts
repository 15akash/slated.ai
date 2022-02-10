import { Component, Input, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { I_meeting } from '@core/services/meeting.service';

@Component({
  selector: 'app-meeting-overlay-weekly',
  templateUrl: './meeting-overlay-weekly.component.html',
  styleUrls: ['./meeting-overlay-weekly.component.scss'],
})
export class MeetingOverlayWeeklyComponent implements OnInit {
  @Input() currentDate: Date = new Date();
  @Input() meetings: I_meeting[] = [];
  timeContainer: any = [];
  weekdays: any = [];

  constructor(private calendarService: CalendarService) {
    this.weekdays = this.calendarService.getWeekdays();
    this.timeContainer = this.calendarService.timeContainer;
  }

  ngOnInit(): void {}
}
