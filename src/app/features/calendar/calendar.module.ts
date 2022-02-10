import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { DateInputComponent } from './components/date-input/date-input.component';
import { MeetingOverlayMonthlyComponent } from './components/meeting-overlay-monthly/meeting-overlay-monthly.component';
import { MeetingOverlayWeeklyComponent } from './components/meeting-overlay-weekly/meeting-overlay-weekly.component';
import { MeetingOverlayDailyComponent } from './components/meeting-overlay-daily/meeting-overlay-daily.component';
import { CurrentTimeMarkerComponent } from './components/current-time-marker/current-time-marker.component';
import { MonthlyComponent } from './views/monthly/monthly.component';
import { WeeklyComponent } from './views/weekly/weekly.component';
import { DailyComponent } from './views/daily/daily.component';
import { CalendarViewSelectionComponent } from './components/calendar-view-selection/calendar-view-selection.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CalendarComponent,
    DateInputComponent,
    MeetingOverlayMonthlyComponent,
    MeetingOverlayWeeklyComponent,
    MeetingOverlayDailyComponent,
    CurrentTimeMarkerComponent,
    MonthlyComponent,
    WeeklyComponent,
    DailyComponent,
    CalendarViewSelectionComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule
  ]
})
export class CalendarModule { }
