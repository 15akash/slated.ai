import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssistantModule } from '../assistant/assistant.module';
import { CalendarSelectionComponent } from './components/calendar-selection/calendar-selection.component';
import { ViewSelectionComponent } from './components/view-selection/view-selection.component';
import { MeetingListItemComponent } from './components/meeting-list-item/meeting-list-item.component';
import { LocationModule } from '../location/location.module';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { PreviewComponent } from './pages/preview/preview.component';
import { BackBtnComponent } from './components/back-btn/back-btn.component';
import { PeopleSelectionComponent } from './components/people-selection/people-selection.component';
import { TypeSelectionComponent } from './components/type-selection/type-selection.component';
import { EmailSelectionComponent } from './components/email-selection/email-selection.component';
import { AccountComponent } from './pages/account/account.component';
import { PeopleComponent } from './pages/people/people.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PeopleInfoComponent } from './pages/people/people-info/people-info.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    CalendarSelectionComponent,
    ViewSelectionComponent,
    MeetingListItemComponent,
    ScheduleComponent,
    PreviewComponent,
    BackBtnComponent,
    PeopleSelectionComponent,
    TypeSelectionComponent,
    EmailSelectionComponent,
    AccountComponent,
    PeopleComponent,
    PeopleInfoComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    AssistantModule,
    LocationModule,
    MatDialogModule,
  ],
})
export class HomeModule {}
