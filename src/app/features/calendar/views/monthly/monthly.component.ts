import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss'],
})
export class MonthlyComponent implements OnInit, OnChanges {
  @Input() nextMonthDates: any = [];
  @Input() calendarDates: any = [];
  @Input() previousMonthDays!: number;
  @Input() meetings: I_meeting[] = [];

  weekdays: any = [];

  constructor(private calendarService: CalendarService) {
    this.weekdays = this.calendarService.getWeekdays();
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  findEvents(eachDate: any) {
    let t = this.meetings
      .filter((item) => item.displayStartDate == eachDate)
      .map((n) => n.name);

    let newArr = [t[0], t[1]].filter((k) => k);
    return {
      events: newArr,
      length: t.length,
    };
  }
}
