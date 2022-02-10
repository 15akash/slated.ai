import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { I_meeting, I_timeslot, MeetingService } from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';
import { formatDay, formatDisplayDate, formatDisplayTime, formatDuration } from '@core/utils/utils';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-invitation',
	templateUrl: './invitation.component.html',
	styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

	attendees: I_people[] = [];

	isLoggedIn = false;
	hasCalendarAccess = false;
	meetingData!: I_meeting;
	durationDisplayStr = "";
	user!: I_people;
	editable: boolean = false;
	isLoadingBestTime = false;
	hostTimeslots: I_timeslot[] = [];
	inviteeTimeslots: I_timeslot[] = [];
	inviteeSelectedTimeslot: I_timeslot | undefined;
	meetingTimeDisplayStr: string = "";
	inviteeEmail: string = "";

	constructor(
		private snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private meetingService: MeetingService,
		private localStorageService: LocalStorageService,
		private authService: AuthService,
		private cdRef: ChangeDetectorRef,
		private dialogService: DialogService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.isLoggedIn = this.authService.isLoggedIn();
		this.user = this.localStorageService.getLocal(LocalKey.user);
		if (this.user && this.user.googleCalendarAPIData) this.hasCalendarAccess = true;
		this.route.paramMap.subscribe((params: ParamMap) => {
			let meetingId = this.route.snapshot.paramMap.get('meetingId') + '';
			this.dialogService.showWait({ msg: "Loading..." });
			if (meetingId) {
				this.meetingService.getMeetingDetail(meetingId).then((r: I_meeting) => {
					this.dialogService.closeWait();
					this.meetingData = r;
					console.log('meeting data=', r);
					this.updateDisplays();
					this.updateAttendees();
					this.updatePermission();
					this.updateHostTimeslots();
					this.decodeURL();

					//this.hostTimeslots = [];
					this.meetingData.allowInviteeBestTime = true;

				});
			}
		});
	}
	decodeURL() {
		const url = this.router.url;
		let paramStr = url.split('?')[1];
		const t = new URLSearchParams(paramStr);
		this.inviteeEmail = t.get('inviteeEmail') || "";
		const selectedTimeslotId = t.get('selectedTimeslotId');
		console.log('selectedTimeslotId=', selectedTimeslotId, this.hostTimeslots);
		if (selectedTimeslotId) {
			let t = this.hostTimeslots.find(x => { return x.id + '' == selectedTimeslotId; });
			if (t) {
				this.inviteeSelectedTimeslot = t;
				this.updateMeetingTimeDisplay();
				t.isSelected = true;
				console.log('hostTimeslots=', this.hostTimeslots);
			}
		}
	}
	updateAttendees() {
		let t = this.meetingData.attendees || [];
		t.forEach(x => {
			if (this.user && x.email == this.user.email) { x.isYou = true; }
			else x.isYou = false;
			if (this.meetingData.creator && x.email == this.meetingData.creator?.email) { x.isCreator = true; }
			else x.isCreator = false;
		})
		this.attendees = t;
	}
	updateDisplays() {
		let duration = this.meetingData.duration;
		if (duration) {
			let hours = (parseInt(duration.value + "")) / 60;
			this.durationDisplayStr = formatDuration(hours, "long");
		}
	}
	updatePermission() {
		this.editable = !!this.user && (this.user.email == this.meetingData.creator?.email);
	}
	updateHostTimeslots() {
		let t = this.meetingData.hostTimeslots;
		t.forEach((x: I_timeslot) => { x.isSelected = false; })
		this.hostTimeslots = t;
	}
	startLogin() {

	}
	getBestTimes() {
		console.log('get best times');
	}

	startEdit(): void { }
	startCancel(): void {
		const canceMeeting = () => {
			this.dialogService.showWait({ msg: "Cancelling..." });
			this.meetingService.cancelMeeting({ ...this.meetingData }).then(r => {
				this.dialogService.closeWait();
				console.log('cancelled meeting=', r);
				if (r.status == 'success') {
					this.meetingData = r.data;
					this.editable = false;
				} else {
					if (r.reason == 'already-cancelled') {
						this.dialogService.openDialog({ title: "Already cancelled", msg: "This meeting is already cancelled." });
					} else if (r.reason == 'no-meeting') {
						this.dialogService.openDialog({ title: "Doesn't exist", msg: "This meeting does not exist." });
					}
				}
			}).catch(e => {
				this.dialogService.closeWait();
				this.dialogService.openDialog({ title: "Oops!", msg: "Could not cancel meeting. Check your internet and try again. If the problem persists, contact support." })
			})
		}
		this.dialogService.openDialog({
			title: "Are you sure?", msg: (this.attendees.length > 1 ? "Meeting link shared with attendees will stop working. <br>" : "") + "This cannot be undone.",
			btns: [
				{ btnTitle: "Yes, cancel meeting", type: "negative", callback: canceMeeting },
				{ btnTitle: "No, don't cancel", type: "positive" }
			]
		});
	}

	onConfirm(e: any, type: string) {
		const selectedTimeslot: I_timeslot = e.data;
		const selectionType = type;
		const meetingData = this.meetingData;

		const goBackToSlate = () => {
			this.router.navigate(['/home']);
		}, startConfirm = () => {
			console.log('startConfirm', email);
			console.log('am i host=', this.meetingService.amIHost(email, meetingData));
			console.log('am i invited=', this.meetingService.amIInvited(email, meetingData));
			if (!this.meetingService.amIInvited(email, meetingData)) {
				return this.dialogService.openDialog({
					title: "You need an invite", msg: `This is a private meeting. Please contact ${meetingData.creator?.email} for an invite`
				});
			}
			if (this.meetingService.amIHost(email, meetingData)) {
				let t = this.meetingService.getTimeslotDisplayStr(new Date(selectedTimeslot.startDtStr));
				return this.dialogService.openDialog({
					title: "You're a host", msg: `Do you wish to confirm meeting time at ${t}?. Invitees will not be able to select or change time once you confirm.`
				});
			}
			console.log('confirm meeting api call');
			this.dialogService.showWait({ msg: "Saving your response..." });
			this.meetingService.confirmMeetingTime(email, selectedTimeslot, selectionType, meetingData).then(r => {
				this.dialogService.closeWait();
				if (r.data.status == 'confirmed') {
					this.dialogService.openDialog({
						title: "Meeting time confirmed", msg: "Congrats on finding the best time!",
						btns: [
							{ btnTitle: "Go to my slate", type: "positive", callback: goBackToSlate },
							{ btnTitle: "Close", type: "neutral" },
						]
					})
				} else if (r.data.status == 'pendingResponse') {
					this.dialogService.openDialog({
						title: "Thank you for your response", msg: "Once all attendees enter the response, we'll send a confirmation email",
						btns: [
							{ btnTitle: "Go to my slate", type: "positive", callback: goBackToSlate },
							{ btnTitle: "Close", type: "neutral" },
						]
					})
				} else if (r.data.status == 'cancelled') {
					this.dialogService.openDialog({
						title: "Meeting cancelled", msg: "Looks like this meeting is cancelled by the host",
						btns: [
							{ btnTitle: "Go to my slate", type: "positive", callback: goBackToSlate },
							{ btnTitle: "Close", type: "neutral" },
						]
					})
				}
			}).catch(e => {
				this.dialogService.closeWait();
				this.dialogService.openDialog({
					title: "Oops!", msg: "Failed to capture your response. Please check your internet and try again. Contact support if the problem persists",
					btns: [
						{ btnTitle: "Go to my slate", type: "positive", callback: goBackToSlate },
						{ btnTitle: "Close", type: "neutral" },
					]
				})
			})
		}, askForEmail = (selectOnly = false) => {
			console.log('Jishnu:ask for email');

		}, resolveEmailConflict = () => {
			console.log('Jishnu: resolve email conflict');
		};
		let email: string;
		const userEmail = this.user.email;
		const inviteeEmail = this.inviteeEmail;
		if (!userEmail && !inviteeEmail) {
			askForEmail();
		} else if (userEmail && inviteeEmail && userEmail != inviteeEmail) {
			resolveEmailConflict();
		} else {
			email = inviteeEmail || userEmail;
			startConfirm();
		}
	}
	onSelect(e: any, fieldName: string) {
		this.hostTimeslots.forEach(x => {
			if (x.id != e.data.id) x.isSelected = false;
		});
		if (e.value) {
			this.inviteeSelectedTimeslot = e.data;
			this.updateMeetingTimeDisplay();
		} else {
			this.inviteeSelectedTimeslot = undefined;
			this.updateMeetingTimeDisplay();
		}
	}
	updateMeetingTimeDisplay() {
		let t: I_timeslot | undefined = this.inviteeSelectedTimeslot;
		if (t) {
			let d = new Date(t.startDtStr);
			this.meetingTimeDisplayStr = this.meetingService.getTimeslotDisplayStr(d);
		} else this.meetingTimeDisplayStr = "";
	}

	onSelectPeople(e: any) {
		if (!e.value || !e.value.email) return;
		if (!this.checkAttendeeExists(e.value.email)) {
			this.attendees.push(e.value);
		} else {
			this.snackBar.open("Email already added", "Dismiss", { duration: 2000 });
		}
	}
	checkAttendeeExists(email: string): boolean {
		let t = this.attendees, alreadyAdded = false;
		for (let i = 0, len = t.length; i < len; i++) {
			if (t[i].email == email) { alreadyAdded = true; break; }
		}
		return alreadyAdded;
	}
	removeAttendee(email: string): boolean {
		let t = this.attendees, newAttendees = [], success = false, removeIndex = -1;
		for (let i = 0, len = t.length; i < len; i++) {
			if (t[i].email == email) { success = true; }
			else newAttendees.push(t[i]);
		}
		this.attendees = newAttendees;
		return success;
	}
	onPeopleMoreClick(e: any) {
		console.log('onMoreItemSelect', e);
	}

}
