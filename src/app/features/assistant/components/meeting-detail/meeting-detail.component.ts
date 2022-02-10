import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { I_meeting } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';
import { formatDisplayDate, formatDisplayTime, getDurationDisplayText } from '@core/utils/utils';

interface I_field {
	displayName: string,
	displayValue: string
	icon: string,
}

@Component({
	selector: 'app-meeting-detail',
	templateUrl: './meeting-detail.component.html',
	styleUrls: ['./meeting-detail.component.scss']
})
export class MeetingDetailComponent implements OnInit, OnChanges {
	@Input('data') meetingData!: I_meeting;
	creator!: I_people;
	displayDate!: string;
	fields: I_field[] = [
		{ displayName: 'Date', displayValue: "", icon: 'clock' },
		{ displayName: 'Time', displayValue: "", icon: 'calendar' },
		{ displayName: 'Duration', displayValue: "", icon: 'focus-time' },
	];

	constructor() { }

	ngOnInit(): void {
		this.setData();
	}
	setData() {
		this.creator = this.meetingData.googleData.creator;//{ email: 'c.jishnu@gmail.com', name: 'Jishnu' };
		this.fields[0].displayValue = formatDisplayDate(new Date(this.meetingData.startDateTime), "dM");
		let startTime = formatDisplayTime(new Date(this.meetingData.startDateTime));
		let endTime = formatDisplayTime(new Date(this.meetingData.endDateTime));
		this.fields[1].displayValue = [startTime, endTime].join(' - ');
		this.fields[2].displayValue = getDurationDisplayText(this.meetingData);
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.meetingData) {
			this.setData();
		}
	}

}
