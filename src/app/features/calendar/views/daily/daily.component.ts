import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss'],
})
export class DailyComponent implements OnInit {
  @Input() currentDate: Date = new Date();
  @Input() meetings: I_meeting[] = [];
  @ViewChild('scrollCon') scrollCon!: ElementRef;
  weekdays: any = [];

  dateToday!: number;
  month = this.currentDate.getMonth();
  year = this.currentDate.getFullYear();

  firstDayOfMonth = new Date(this.year, this.month, 1);
  daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
  daysInPreviousMonth = new Date(this.year, this.month, 0).getDate();

  timeContainer: any = [];
  @Input() monthDisplay: any = [];

  constructor(private calendarService: CalendarService) {
    this.timeContainer = this.calendarService.timeContainer;
    this.weekdays = this.calendarService.getWeekdays();
    this.monthDisplay = this.calendarService.getDateWithMonthAndYear();
  }

  ngOnInit(): void {
    console.log(this.daysInMonth, this.dateToday, this.daysInPreviousMonth);
  }

  ngAfterViewChecked(): void {
    this.scrollTo();
  }

  scrollTo() {
    let currentTime = this.currentDate.getHours();
    if (this.scrollCon)
      this.scrollCon.nativeElement.scrollTo({ top: 60 * currentTime });
  }

  getDayToday() {
    let todayIndex = this.currentDate.getDay();
    let today = this.weekdays[todayIndex].displayName;
    return today;
  }

  nextDate() {
    this.dateToday = this.currentDate.getDate();
    let t = this.dateToday;
    t++;
    if (t > this.daysInMonth) {
      t = 1;
    }
    console.log('clicked');
    return t;
    this.getDayToday();
  }

  previousDate() {
    let t = this.dateToday;
    t--;
    if (t < 1) {
      this.dateToday = this.daysInPreviousMonth;
    }
    console.log('clicked');
  }
}
