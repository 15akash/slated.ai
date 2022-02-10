import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { I_option } from '@core/services/data.service';
import { I_meeting } from '@core/services/meeting.service';
import { CalendarService } from './services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() view: string = 'weekly'; //monthly, daily
  @Input() currentDate: Date = new Date();

  meetings: I_meeting[] = [
    //Put dummy data here for testing
    {
      name: 'Daily catchup',
      displayStartDate: '30',
      startDateTime: '9:00 AM',
      endDateTime: '10:00 AM',
    },
    {
      name: 'Frontend catchup',
      displayStartDate: '30',
      startDateTime: '1:00 PM',
      endDateTime: '3:00 PM',
    },
    {
      name: 'backend',
      displayStartDate: '15',
      startDateTime: '10',
      endDateTime: '10',
    },
    {
      name: 'frontend',
      displayStartDate: '10',
      startDateTime: '10',
      endDateTime: '10',
    },
    {
      name: 'ui developer',
      displayStartDate: '2',
      startDateTime: '10',
      endDateTime: '10',
    },
    {
      name: 'ui design',
      displayStartDate: '1',
      startDateTime: '10:00 AM',
      endDateTime: '100',
    },
  ];

  calendarDates: number[] = [];
  public monthNav: number = 0;

  public clicked: any = null;
  isViewShown = false;
  showDatePicker = false;
  weekdays: I_option[] = [];

  day = this.currentDate.getDate();
  month = this.currentDate.getMonth();
  year = this.currentDate.getFullYear();

  fullCurrentMonth: string = '';
  previousMonthDays!: number;

  constructor(private calendarService: CalendarService) {
    this.weekdays = this.calendarService.getWeekdays();
    this.updateCalendarDates(this.year, this.month);
    this.fullCurrentMonth = this.calendarService.getMonthDisplayText();
  }

  ngOnInit(): void {}

  dailyEvents() {}

  updateCalendarDates(year: number, month: number): void {
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let firstDayOfMonth = new Date(year, month, 1);
    let dateString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    let w = this.weekdays.map((x) => {
      return x.displayName;
    });
    this.previousMonthDays = w.indexOf(dateString.split(', ')[0]);
    let t = [];
    for (let i = 0; i < this.previousMonthDays + daysInMonth; i++) {
      t.push(i + 1);
    }
    this.calendarDates = t;
    this.fullCurrentMonth = this.calendarService.getMonthDisplayText(
      new Date(month + 1 + '/1/' + year)
    );
  }
  nextMonth() {
    let t = this.monthNav;
    t++;
    if (t > 11) {
      this.year++;
      this.monthNav = 0;
    } else {
      this.monthNav = t % 12;
    }
    this.updateCalendarDates(this.year, this.monthNav);
    console.log(this.monthNav, this.previousMonthDays);
  }

  previousMonth() {
    let t = this.monthNav;
    t--;
    if (t < 0) {
      this.year--;
      this.monthNav = 11;
    } else {
      this.monthNav = t;
    }
    this.updateCalendarDates(this.year, this.monthNav);
  }

  toggleViewDropdown() {
    this.isViewShown = !this.isViewShown;
  }
  showDateInput() {
    this.showDatePicker = !this.showDatePicker;
  }

  meetingHeight() {}
}
