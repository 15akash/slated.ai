import { Component, Input, OnInit } from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { formatDisplayDate } from '@core/utils/utils';

@Component({
	selector: 'app-previous-meeting',
	templateUrl: './previous-meeting.component.html',
	styleUrls: ['./previous-meeting.component.scss']
})
export class PreviousMeetingComponent implements OnInit {

	@Input() data!: I_meeting;
	constructor() {
	}

	ngOnInit(): void {
		this.data.displayStartDate = formatDisplayDate(new Date(this.data.startDateTime), "dMY", "none");
	}

}
