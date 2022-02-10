import { Component, Input, OnInit } from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';

import {
  AssistantService,
  I_listItem,
} from 'src/app/features/assistant/services/assistant.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  panelOpenState = false;
  dateToday = new Date().getDate();
  @Input() view: string = 'intro';

  @Input() meetings: I_meeting[] = [
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
      startDateTime: '12:00 PM',
      endDateTime: '1:00 PM',
    },
    {
      name: 'frontend',
      displayStartDate: '9',
      startDateTime: '10:00 AM',
      endDateTime: '11:00 AM',
    },
  ];

  @Input() attendees: I_people[] = [
    { photoUrl: '', name: 'Akash Jindal', email: 'akash.jindal@slated.ai' },
    { name: 'Random name 1', email: '1random1@slated.ai' },
    { name: 'Random name 2', email: '2random2@slated.ai' },
    { name: 'Random name 3', email: '3random3@slated.ai' },
    { name: 'Random name 4', email: '4random4@slated.ai' },
    { name: 'Random name 5', email: '5random5@slated.ai' },
    { name: 'Random name 6', email: '6random6@slated.ai' },
    { name: 'Random name 7', email: '7random7@slated.ai' },
    { name: 'Random name8', email: '8random8@slated.ai' },
    { name: 'Random name 1', email: '1random1@slated.ai' },
    { name: 'Random name 2', email: '2random2@slated.ai' },
    { name: 'Random name 3', email: '3random3@slated.ai' },
    { name: 'Random name 4', email: '4random4@slated.ai' },
    { name: 'Random name 5', email: '5random5@slated.ai' },
    { name: 'Random name 6', email: '6random6@slated.ai' },
    { name: 'Random name 7', email: '7random7@slated.ai' },
    { name: 'Random name8', email: '8random8@slated.ai' },
    { name: 'Random name 1', email: '1random1@slated.ai' },
    { name: 'Random name 2', email: '2random2@slated.ai' },
    { name: 'Random name 3', email: '3random3@slated.ai' },
    { name: 'Random name 4', email: '4random4@slated.ai' },
    { name: 'Random name 5', email: '5random5@slated.ai' },
    { name: 'Random name 6', email: '6random6@slated.ai' },
    { name: 'Random name 7', email: '7random7@slated.ai' },
    { name: 'Random name8', email: '8random8@slated.ai' },
  ];

  isShowingMore: boolean = false;
  moreList: I_listItem[] = [];
  enableAutoClose: boolean = false;
  displayAttendee!: I_people;

  constructor(private assistantService: AssistantService) {
    this.moreList = this.assistantService.getPeoplePageOptions(this.view);
  }

  ngOnInit(): void {
    this.displayAttendee = this.attendees[0];
  }

  selectedAttendee(item: any) {
    this.displayAttendee = item;
  }

  closeMoreList(): void {
    this.isShowingMore = false;
    document.removeEventListener('click', this.onOutsideClick);
  }
  onOutsideClick = (e: MouseEvent): any => {
    if (this.isShowingMore && this.enableAutoClose) {
      this.enableAutoClose = false;
      this.closeMoreList();
    }
  };

  showMoreList(): void {
    document.addEventListener('click', this.onOutsideClick);
    Promise.resolve().then(() => {
      this.isShowingMore = true;
      this.enableAutoClose = false;
      setTimeout(() => {
        this.enableAutoClose = true;
      }, 300);
    });
  }

  upcomingMeetings() {
    let t = this.meetings.filter(
      (date: any) => date.displayStartDate >= this.dateToday
    );
    return t;
  }

  previousMeetings() {
    let t = this.meetings.filter(
      (date: any) => date.displayStartDate < this.dateToday
    );
    return t;
  }

  handleAccountActions(item: any) {
    switch (item.displayName) {
      case 'Delete':
        let deleteAttendee = this.displayAttendee.email;
        let index = this.attendees.findIndex((x) => x.email === deleteAttendee);
        if (index > -1) {
          this.attendees.splice(index, 1);
          this.displayAttendee = this.attendees[0];
        }
        break;
    }
  }
}
