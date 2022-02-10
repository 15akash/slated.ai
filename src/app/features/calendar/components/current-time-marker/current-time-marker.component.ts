import { Input, Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-current-time-marker',
  templateUrl: './current-time-marker.component.html',
  styleUrls: ['./current-time-marker.component.scss'],
})
export class CurrentTimeMarkerComponent implements OnInit {
  @Input() currentDate: Date = new Date();
  @ViewChild('scrollCon') scrollCon!: ElementRef;
  hours = this.currentDate.getHours();
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.scrollTo();
  }

  scrollTo() {
    let currentTime = this.currentDate.getHours();
    if (this.scrollCon)
      this.scrollCon.nativeElement.scrollTo({ top: 60 * currentTime });
  }

  hoursFormat() {
    let t = this.hours;
    if (t < 1) {
      return 12;
    } else if (t > 12) {
      return t - 12;
    } else return t;
  }

  hoursDisplay() {
    let t = this.hoursFormat();
    if (t < 10) return `0${t}`;
    else return t;
  }

  minutesDisplay() {
    let minutes = this.currentDate.getMinutes();
    if (minutes < 10) return `0${minutes}`;
    return minutes;
  }

  currentTime() {
    let AmPmSymbol = this.hours > 12 ? 'PM' : 'AM';
    return `${this.hoursDisplay()}:${this.minutesDisplay()} ${AmPmSymbol}`;
  }
}
