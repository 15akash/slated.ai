import { Component, Input, OnInit } from '@angular/core';
import { I_people } from '@core/services/people.service';

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

	@Input() data!: I_people;
	@Input() size: string = 'medium';
	@Input() displayText!: string;

	initialType = 'external';
	initials = 'Ext.';

	constructor() { }

	ngOnInit(): void {
		if (this.displayText) {

		} else if (this.data) {
			if (this.data.name) {
				let t = this.data.name.split(" ");
				if (t.length == 1) {
					this.initials = t[0].substring(0, 2).toUpperCase();
				} else if (t.length > 1) {
					let first = t[0].substring(0, 1).toUpperCase();
					let last = t[t.length - 1].substring(0, 1).toUpperCase();
					this.initials = first + last;
				}
				this.initialType = 'internal';
			} else if (this.data.email) {
				this.initials = this.data.email.substring(0, 2).toUpperCase();
				this.initialType = 'external';
			}
			if (this.data.photoUrl) {
				this.initialType = 'internal';
			}
		}
	}

}
