import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { I_option } from '@core/services/data.service';
import { I_meeting } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';
import { formatDisplayTime, formatDuration } from '@core/utils/utils';

@Component({
	selector: 'app-meeting-list-item',
	templateUrl: './meeting-list-item.component.html',
	styleUrls: ['./meeting-list-item.component.scss']
})
export class MeetingListItemComponent implements OnInit {

	test1 = {
		email: 'ninoy.job@gmail.com'
	};
	test2 = {
		name: 'Frana James',
		email: 'ninoy.job@gmail.com'
	};
	test3 = {
		name: 'Jishnu',
		// photoUrl: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/V8BNOaftJmYoidBlou5U2xg_4kfId3jMgCLcDEAEiGQoBShD___________8BGJ6i0f_______wE/s544-p-k-rw-no/photo.jpg',
		email: 'ninoy.job@gmail.com'
	};

	@Input() data!: I_meeting;
	fromTime: string = "";
	toTime: string = "";
	duration: string = "";
	visibleAttendees: I_people[] = [];
	hiddenAttendees: I_people[] = [];
	hiddenAttendeesDisplay: string = "";

	isMenuOpen = false;
	moreOptions: I_option[] = [
		// { _id: '1', displayName: 'Edit', icon: 'edit2' },
		{ _id: '2', displayName: 'Copy link', icon: 'copy' },
		{ _id: '3', displayName: 'Share meeting', icon: 'share' },
		{ _id: '4', displayName: 'Cancel meeting', icon: 'cancel' },
		{ _id: '5', displayName: 'Reschedule', icon: 'reschedule' },
		// { _id: '6', displayName: 'Delete', icon: 'delete' },
	];
	selectedItem: I_option = this.moreOptions[0];
	previousItem: I_option = this.selectedItem;
	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	@Output() select = new EventEmitter();
	@Output() change = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		if (this.data) {
			let d1 = new Date(this.data.startDateTime);
			let d2 = new Date(this.data.endDateTime);
			let durationInHours = (d2.getTime() - d1.getTime()) / (60 * 60 * 1000);
			this.fromTime = formatDisplayTime(d1);
			this.toTime = formatDisplayTime(d2);
			this.duration = formatDuration(durationInHours, 'long');

			let a = this.data.attendees || [];
			this.visibleAttendees = a.length ? a.slice(0, 3) : [];
			this.hiddenAttendees = a.length > 3 ? a.slice(3) : [];
			this.hiddenAttendeesDisplay = this.hiddenAttendees.length ? "+" + (this.hiddenAttendees.length) : "";
		}
	}
	onOpenMenu(): void {
		this.isMenuOpen = true;
	}
	onCloseMenu(): void {
		this.isMenuOpen = false;
	}
	onMenuClick(e: MouseEvent): void {
		e.stopPropagation();
	}
	onMoreItemSelect(item: I_option, index: number) {
		this.menuTrigger.closeMenu();
		this.previousItem = this.selectedItem;
		this.selectedItem = item;
		this.change.emit({ value: item, previousValue: this.previousItem });
	}

	onLocationClick() {

	}
	onSelect(): void {
		this.select.emit({ action: 'selected', data: {} });
	}
}
