import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { I_option } from '@core/services/data.service';
import { I_meeting } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';

@Component({
	selector: 'app-meeting',
	templateUrl: './meeting.component.html',
	styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
	tabIcons: I_option[] = [
		// { _id: 'zoom', displayName: 'Zoom link', icon: 'zoom' },
		// { _id: 'google-meet', displayName: 'Google-meet link', icon: 'google-chat' },
		// { _id: 'video-call', displayName: 'Video-call link', icon: 'video_s' },
		{ _id: 'location', displayName: 'Location', icon: 'location' },
		{ _id: 'link', displayName: 'Open meeting link', icon: 'link' },
		{ _id: 'edit', displayName: 'Edit', icon: 'edit2' },
		// { _id: 'more', displayName: 'More', icon: 'more' },
	];
	moreOptions: I_option[] = [
		{ _id: 'link', displayName: 'Open meeting link', icon: 'link' },
		{ _id: 'copy', displayName: 'Copy link', icon: 'copy' },
		{ _id: 'share', displayName: 'Share meeting', icon: 'share' },
		{ _id: 'cancel', displayName: 'Cancel meeting', icon: 'cancel' },
		{ _id: 'reschedule', displayName: 'Reschedule', icon: 'reschedule' },
		{ _id: 'delete', displayName: 'Delete', icon: 'delete' },
	];
	tabItems: I_option[] = [
		{ _id: 'details', displayName: 'Details' },
		{ _id: 'people', displayName: 'People' },
		// { _id: 'notes', displayName: 'Notes' },
		// { _id: 'previous', displayName: 'Previous' },
	];

	@Input() selectedTabId: string = 'details';
	@Input() meetingData!: I_meeting;
	@Input() previousMeetings!: I_meeting[];
	creator!: I_people;
	@ViewChild('tabContentCon') tabContentCon!: ElementRef;

	constructor() { }

	ngOnInit(): void {
		// this.meetingData = {
		// 	_id: 'abcd',
		// 	name: 'Daily Catch upp',
		// 	startDateTime: '2022-01-10T14:42:26.184Z',
		// 	endDateTime: '2022-01-10T18:30:00.000Z',
		// 	attendees: [
		// 		{ email: 'c.jishnu@gmail.com', name: 'Jishnu', photoUrl: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/V8BNOaftJmYoidBlou5U2xg_4kfId3jMgCLcDEAEiGQoBShD___________8BGJ6i0f_______wE/s544-p-k-rw-no/photo.jpg' },
		// 		{
		// 			email: 'rocket@gmail.com', name: 'Rocket', timeZone: {
		// 				"_id": "6",
		// 				"groupName": "South Asia",
		// 				"name": "Asia/Kolkata",
		// 				"utcOffset": 330,
		// 				"abbreviation": "IST",
		// 				"displayText": "India Standard Time",
		// 				"places": "Bengaluru, Bangalore, Chennai, Mumbai, New Delhi, Hyderabad",
		// 				"searchKeywords": ""
		// 			}
		// 		},
		// 	],
		// 	description: "All dogs have an expression of pleasure or contentment, which you'll recognise as you get to know a particular animal. However, owners of some breeds believe their dogs are more smiley than average and therefore happier. This is mistaken, Alleyne says. Generally, dogs with broad faces - staffies, rottweilers - look like they're grinning. The same expression on a German shepherd will look like it's curling its lips back."
		// };
		this.previousMeetings = [
			{
				name: 'UX/UI discussion',
				startDateTime: '2022-01-10T08:17:03.985Z',
				endDateTime: '2022-01-10T08:17:03.985Z'
			},
			{
				name: 'Discussion',
				startDateTime: '2022-01-12T09:30:00.000Z',
				endDateTime: '2022-01-12T09:30:00.000Z',
			}
		];


	}
	onTabIconClick(tabIcon: I_option) {
		console.log('on tab icon click', tabIcon);
	}
	onTabClick(tabItem: I_option, tabIndex: number) {
		this.selectedTabId = tabItem._id;
		this.tabContentCon.nativeElement.style.transform = 'translateX(' + (-tabIndex * 25) + '%)';
	}

}
