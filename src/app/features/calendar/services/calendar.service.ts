import { Injectable } from '@angular/core';
import { I_option } from '@core/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}
  timeContainer: any = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  getWeekdays(): I_option[] {
    return [
      { _id: '0', displayName: 'Sunday', shortName: 'Sun' },
      { _id: '1', displayName: 'Monday', shortName: 'Mon' },
      { _id: '2', displayName: 'Tuesday', shortName: 'Tue' },
      { _id: '3', displayName: 'Wednesday', shortName: 'Wed' },
      { _id: '4', displayName: 'Thursday', shortName: 'Thu' },
      { _id: '5', displayName: 'Friday', shortName: 'Fri' },
      { _id: '6', displayName: 'Saturday', shortName: 'Sat' },
    ];
  }

  getDaysInMonth(month: number, year: number): number {
    return 0;
  }
  getFirstDayOfMonth(month: number, year: number): number {
    return 0;
  }
  getPreviousMonthDays() {}
  getMonthDisplayText(date: Date = new Date()): string {
    let year = date.getFullYear();
    let t = `${date.toLocaleDateString('en-us', {
      month: 'long',
    })}, ${year}`;
    return t;
  }

  getDateWithMonthAndYear(date: Date = new Date()): string {
    let day = date.getDate();
    let year = date.getFullYear();
    let t = `${day} ${date.toLocaleDateString('en-us', {
      month: 'long',
    })} ${year}`;
    return t;
  }
}
