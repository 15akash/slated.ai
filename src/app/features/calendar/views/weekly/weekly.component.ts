import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
})
export class WeeklyComponent implements OnInit, AfterViewChecked {
  @Input() currentDate: Date = new Date();
  @Input() meetings: I_meeting[] = [];
  @ViewChild('scrollCon') scrollCon!: ElementRef;

  epoch = new Date().getTime();
  daysIndex!: number;

  timeContainer: any = [];
  weekdays: any = [];

  constructor(private calendarService: CalendarService) {
    this.weekdays = this.calendarService.getWeekdays();
    this.timeContainer = this.calendarService.timeContainer;
  }

  ngOnInit(): void {
    this.getWeeklyCalendar();
  }

  ngAfterViewChecked(): void {
    this.scrollTo();
  }

  scrollTo() {
    let currentTime = this.currentDate.getHours();
    if (this.scrollCon)
      this.scrollCon.nativeElement.scrollTo({ top: 60 * currentTime });
  }

  getWeeklyCalendar() {
    let t = this.epoch - 24 * 60 * 60 * 1000;
    let date = new Date(t);

    for (let i = 0; i < this.weekdays.length; i++) {
      this.weekdays[i];
      let selectedDate = new Date();
      let dateString = selectedDate.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      let day = this.weekdays.map((x: any) => {
        return x.displayName;
      });
      this.daysIndex = day.indexOf(dateString.split(', ')[0]);
      this.weekdays[i].date = new Date(
        this.epoch + 24 * 60 * 60 * 1000 * (i - this.daysIndex)
      );
    }

    // return date;
  }
}
