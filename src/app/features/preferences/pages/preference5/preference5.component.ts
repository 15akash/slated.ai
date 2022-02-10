import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, I_option } from '@core/services/data.service';
import { fader, slider } from 'src/app/route-animations';
import { PreferenceService } from '../../services/preference.service';

@Component({
	selector: 'app-preference5',
	templateUrl: './preference5.component.html',
	styleUrls: ['./preference5.component.scss'],
	animations: [slider],
	host: {
		'[@routeAnimations]': 'animState',
		'(@routeAnimations.start)': 'captureStartEvent($event)',
		'(@routeAnimations.done)': 'captureDoneEvent($event)',
	}
})
export class Preference5Component implements OnInit {
	public preferenceForm: FormGroup;
	activityOptions: I_option[] = [];
	selectedActivityOptions: I_option[] = [];
	isActivityOpen = false;

	openActivityOptions: any[] = [1];

	activityTimeOptions: I_option[] = [];
	activityDurationOptions: I_option[] = [];
	isActivityTimeOpen: any = {};
	isActivityDurationOpen: any = {};

	test: boolean = true;
	isReady = false;
	animState: any;
	currentPage = 5;

	constructor(
		private fb: FormBuilder,
		private dataService: DataService,
		private preferenceService: PreferenceService,
	) {
		this.preferenceForm = this.fb.group({
			preferredActivitys: ['', [Validators.required]]
		});
		this.activityOptions = this.dataService.getActivityOptions();
		this.selectedActivityOptions = [];
		this.activityTimeOptions = this.dataService.getActivityTimeOptions();
		this.activityDurationOptions = this.dataService.getActivityDurationOptions();
		this.animState = 'none';
	}
	get gf() {
		return this.preferenceForm.controls;
	}

	ngOnInit(): void {
	}
	next(): void {
		if (!this.preferenceForm.valid) return;
		this.preferenceService.next(this.preferenceForm.value, this.currentPage);
	}
	previous(): void { this.preferenceService.onPrevious(this.currentPage); }
	skip(): void { this.preferenceService.onSkip(this.currentPage); }
	remindLater(): void { this.preferenceService.onRemindLater(this.currentPage); }

	getDefaultStartHour(item: I_option): I_option[] {
		let t = this.dataService.getTimeOptionFromStartHour(item.defaultStartHour || 0);
		return [t];
	}
	getDefaultDuration(item: I_option): I_option[] {
		let t = this.dataService.getDurationOptionFromMinutes(item.defaultDuration || 0);
		return [t];
	}

	onSetActivity(event: any): void {
		if (event.action == 'checked') {
			let existingIds = this.selectedActivityOptions.map(x => { return x._id });
			let t: I_option[] = [];
			event.selectedOptions.forEach((x: I_option) => {
				if (existingIds.indexOf(x._id) < 0) {
					this.selectedActivityOptions.push(x);
				}
			});
		} else {
			if (event.selectedOptions.length) this.selectedActivityOptions = this.selectedActivityOptions.filter(x => { return x._id != event.changedOption._id; })
			else this.selectedActivityOptions = [];
		}
		//console.log('on set activity', this.selectedActivityOptions);
		this.preferenceForm.patchValue({ preferredActivitys: this.selectedActivityOptions });
	}
	onOpenActivity(event: any): void { this.isActivityOpen = true; }
	onCloseActivity(event: any): void {
		//console.log('on close activity', this.test);
		this.test = false;
		this.isActivityOpen = false;
	}

	onSetActivityTime(event: any, item: I_option): void {
		//console.log('on set activity time', event.selectedOptions, item);
		let startHour = event.selectedOptions[0];
		for (let i = 0, len = this.selectedActivityOptions.length; i < len; i++) {
			let t = this.selectedActivityOptions[i];
			if (t._id == item._id) { t.defaultStartHour = startHour.value; break; }
		}
		this.preferenceForm.patchValue({ preferredActivitys: this.selectedActivityOptions });
	}
	onOpenActivityTime(event: any, item: I_option): void { this.isActivityTimeOpen[item._id] = true; }
	onCloseActivityTime(event: any, item: I_option): void { this.isActivityTimeOpen[item._id] = false; }
	onSetActivityDuration(event: any, item: I_option): void {
		//console.log('on set activity duration', event.selectedOptions, item);
		let duration = event.selectedOptions[0];
		for (let i = 0, len = this.selectedActivityOptions.length; i < len; i++) {
			let t = this.selectedActivityOptions[i];
			if (t._id == item._id) { t.defaultDuration = duration.value; break; }
		}
		this.preferenceForm.patchValue({ preferredActivitys: this.selectedActivityOptions });
	}
	onOpenActivityDuration(event: any, item: I_option): void { this.isActivityDurationOpen[item._id] = true; }
	onCloseActivityDuration(event: any, item: I_option): void { this.isActivityDurationOpen[item._id] = false; }

	deleteActivity(index: number): void {
		this.selectedActivityOptions.splice(index, 1);
		//console.log('on delete activity', this.selectedActivityOptions);
		let t = [];
		for (let i = 0, len = this.selectedActivityOptions.length; i < len; i++) { t.push(this.selectedActivityOptions[i]); }
		this.selectedActivityOptions = t;
	}

	captureStartEvent(event: AnimationEvent) { this.animState = 'anim-start'; }
	captureDoneEvent(event: AnimationEvent) { this.animState = 'anim-done'; setTimeout(() => { this.isReady = true; }, 400); }

}
