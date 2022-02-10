import { Component, Input, OnInit } from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';
import { TimezoneService } from '@core/services/timezone.service';
import { formatDisplayDate } from '@core/utils/utils';

@Component({
  selector: 'app-assistant-people-item',
  templateUrl: './people-list-item.component.html',
  styleUrls: ['./people-list-item.component.scss'],
})
export class PeopleListItemComponent implements OnInit {
  @Input() data!: I_people;
  timeZoneDisplay: string = '';
  constructor(private timezoneService: TimezoneService) {}

  ngOnInit(): void {
    if (this.data.timeZone) {
      this.timeZoneDisplay = this.timezoneService.getLocalCurrentTime(
        this.data.timeZone
      );
    }
  }
}
