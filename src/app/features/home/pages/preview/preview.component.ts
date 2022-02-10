import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I_option } from '@core/services/data.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { I_people } from '@core/services/people.service';
import { Router } from '@angular/router';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { I_btnItem } from 'src/app/features/assistant/services/assistant.service';
import { I_meeting, I_timeslot, MeetingService } from '@core/services/meeting.service';
import { formatDisplayDate } from '@core/utils/utils';

@Component({
	selector: 'app-preview',
	templateUrl: './preview.component.html',
	styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

	previewForm!: FormGroup;
	allTimeslots = [
		// 1, 2, 3, 4, 5, 6, 7, 8
	];
	numTimeslotOptions: I_option[] = [
		{ _id: '1', displayName: '1', value: 1 },
		{ _id: '2', displayName: '2', value: 2 },
		{ _id: '3', displayName: '3', value: 3 },
		{ _id: '4', displayName: '4', value: 4 },
		{ _id: '5', displayName: '5', value: 5 },
		{ _id: '6', displayName: '6', value: 6 },
		{ _id: '7', displayName: '7', value: 7 },
		{ _id: '8', displayName: '8', value: 8 },
		{ _id: '9', displayName: '9', value: 9 },
		{ _id: '10', displayName: '10', value: 10 },
	];
	attendees: I_people[] = [];
	user: I_people;
	meetingLink!: string;

	@ViewChild('editor') editor!: ElementRef;
	constructor(
		private snackBar: MatSnackBar,
		private clipboard: Clipboard,
		private fb: FormBuilder,
		private router: Router,
		private localStorageService: LocalStorageService,
		private dialogService: DialogService,
		private meetingService: MeetingService
	) {
		this.user = this.localStorageService.getLocal(LocalKey.user);
		let name = "Meeting title";
		let numTimeslots = this.numTimeslotOptions[2];
		let timeslots = [];

		let scheduleFormValue = this.localStorageService.getLocal(LocalKey.scheduleFormValue);
		if (scheduleFormValue) {
			this.attendees = scheduleFormValue.attendees.filter((x: I_people) => { return x.email != this.user.email; });
			name = scheduleFormValue.name.displayName;
			this.allTimeslots = scheduleFormValue.hostTimeslots || [];
			this.numTimeslotOptions = this.numTimeslotOptions.slice(0, this.allTimeslots.length);
			let max = this.allTimeslots.length > 2 ? 2 : this.allTimeslots.length - 1;
			if (this.numTimeslotOptions.length) {
				numTimeslots = this.numTimeslotOptions[max];
				timeslots = this.updateTimeslots(parseInt('0' + numTimeslots.value));
			}
			this.meetingLink = scheduleFormValue.meeting.link;
		}
		this.previewForm = this.fb.group({
			attendees: [this.attendees, [Validators.required]],
			name: [name, [Validators.required, Validators.minLength(1)]],
			timeslots: [timeslots],
			allowInviteeBestTime: [true, Validators.required],
			showTimeslots: [!!timeslots.length, Validators.required],
			numTimeslots: [numTimeslots, Validators.required],
		});
	}
	get gf() { return this.previewForm.controls; }

	updateTimeslots(numTimeslots: number): any {
		let timeslots = this.allTimeslots.slice(0, parseInt('0' + numTimeslots));
		return timeslots;
	}
	ngOnInit(): void { }

	onBackClick(): void {
		this.router.navigate(['home/schedule']);
	}

	showEmailSent(link: string): void {
		//const link = "https://app.myslate.us/meeting/?id=1234";
		const goBackHome = () => {
			this.localStorageService.clearLocal(LocalKey.scheduleFormValue);
			this.router.navigate(['/home']);
		}, openMeetingLink = () => {
			window.open(link, "_blank");
		}
		this.dialogService.openDialog({
			title: "Email sent", link,
			btns: [
				{ btnTitle: "Back to my slate", type: "positive", callback: goBackHome },
				{ btnTitle: "Open the meeting", type: "neutral", callback: openMeetingLink },
			]
		});
	}
	startInviteEmail(): void {
		let scheduleFormValue = this.localStorageService.getLocal(LocalKey.scheduleFormValue);
		let previewFormValue = this.previewForm.value;
		let data = { ...scheduleFormValue, ...previewFormValue };
		this.dialogService.showWait({ msg: "Sending email" + (this.gf.attendees.value.length > 1 ? "s" : "") });
		this.meetingService.sendMeetingEmail(data).then(r => {
			this.dialogService.closeWait();
			this.showEmailSent(scheduleFormValue.link);
		}).catch(e => {
			this.dialogService.closeWait();
			this.dialogService.openDialog({ title: "Oops!", msg: "Failed to send emails" });
		});
	}
	startCancel(): void {
		const cancelMeeting = () => {
			this.localStorageService.clearLocal(LocalKey.scheduleFormValue);
			this.router.navigate(['/home']);
		}
		this.dialogService.openDialog({
			title: "Unsaved changes", msg: "If you continue, current scheduling request will be lost.",
			btns: [
				{ btnTitle: "Don't save", type: "neutral", callback: cancelMeeting },
				{ btnTitle: "Cancel", type: "positive" },
			]
		});
	}
	copyTitle(e: any) {
		this.clipboard.copy(this.gf.name.value || "SlatedAI Meeting");
		this.snackBar.open("Meeting name copied to clipboard", "Dismiss", { duration: 3000 });
	}
	copyEmailContent(e: any) {
		let showTimeslots = this.gf.showTimeslots.value;
		let allowInviteeBestTime = this.gf.allowInviteeBestTime.value;
		let text = "";
		let hostName = this.user.name || this.user.email;
		if (!showTimeslots && !allowInviteeBestTime) {
			text = `Hi,

			Hope you are doing well! I've invited you for a meeting.
			
			Please RSVP by clicking here: ${this.meetingLink}
			
			Thank you!
			${hostName}`;
		} else if (!showTimeslots && allowInviteeBestTime) {
			text = `Hi,

			Hope you are doing well! I've invited you for a meeting.
			
			Please click here: ${this.meetingLink} to find a best time that would work for both of us.
			
			Thank you!
			${hostName}`;
		} else if (showTimeslots && !allowInviteeBestTime) {
			text = `Hi,

			Hope you are doing well! Do the following times work for you? If so, please click on the link given below to select:
			
			${this.getTimeslotListAsText()}

			Please click here to select the time: ${this.meetingLink}			
			
			Thank you!
			${hostName}`;
		} else {
			text = `Hi,

			Hope you are doing well! Do the following times work for you?
			
			${this.getTimeslotListAsText()}

			If not, please click here to select or find another suitable time: ${this.meetingLink}
			
			Thank you!
			${hostName}`;
		}
		this.clipboard.copy(text || this.editor.nativeElement.innerText);
		this.snackBar.open("Email copied to clipboard", "Dismiss", { duration: 3000 });
	}
	getTimeslotListAsText() {
		let timeslots = this.gf.timeslots.value;
		let timeslotList = "";
		timeslots.forEach((t: I_timeslot) => {
			timeslotList += `${formatDisplayDate(new Date(t.startDtStr), "shortMonth date, 'shortYear")}
			`;
		});
		return timeslotList;

		// return `
		// 10am, Mon - 15 min Feb 1, '22
		// 10am, Mon - 15 min Feb 2, '22
		// 10am, Mon - 15 min Feb 3, '22
		// `;
	}
	onSelect(e: any, field: string) {
		if (field == 'numTimeslot') {
			let t = this.updateTimeslots(e.value.value);
			this.previewForm.patchValue({
				numTimeslots: e.value,
				timeslots: t
			});
		}
	}
	onToggle(e: MatSlideToggleChange, field: string) {
		this.previewForm.get('' + field)?.patchValue(e.checked);
	}

	onChangeAttendee(e: any) {
		this.attendees = e.attendees;
		this.previewForm.patchValue({ attendees: e.attendees });
	}

}
