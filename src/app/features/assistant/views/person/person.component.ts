import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-person',
	templateUrl: './person.component.html',
	styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
	personData: any = {
		name: 'Jishnu Choyi',
		title: '',
		email: 'c.jishnu@gmail.com',
		//photoUrl: 'https://lh3.googleusercontent.com/a-/AOh14GgqU2kmye0XtnpNRZZdOcngqCvYcnRdbWP-QpGTyA=s480-p-k-rw-no',
		timezoneDisplayText: '10:00am, India Standard Time',
		linkedInLink: 'https://www.linkedin.com/',
		facebookLink: 'https://www.facebook.com/',
		githubLink: 'https://github.com/',
		twitterLink: 'https://twitter.com/',
		instagramLink: 'https://www.instagram.com/',
	}
	previousMeetings: any[] = [
		{
			name: 'UX/UI discussion',
			startDateTime: '2022-01-10T08:17:03.985Z'
		},
		{
			name: 'Discussion',
			startDateTime: '2022-01-12T09:30:00.000Z'
		},
	]

	constructor() { }

	ngOnInit(): void {
	}
	onLinkClick(link: string) {
		console.log('link=', link);
		window.open(link, '_blank')
	}

}
