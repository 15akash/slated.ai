import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, I_option } from '@core/services/data.service';
import { fader, slider } from 'src/app/route-animations';
import { PreferenceService } from '../../services/preference.service';

@Component({
	selector: 'app-preference2',
	templateUrl: './preference2.component.html',
	styleUrls: ['./preference2.component.scss'],
	animations: [slider],
	host: {
		'[@routeAnimations]': 'animState',
		'(@routeAnimations.start)': 'captureStartEvent($event)',
		'(@routeAnimations.done)': 'captureDoneEvent($event)',
	}
})
export class Preference2Component implements OnInit {
	public preferenceForm: FormGroup;
	scheduleOptions: I_option[] = [];
	selectedScheduleOptions: I_option[] = [];
	durationOptions: I_option[] = [];
	selectedDurationOptions: I_option[] = [];
	isScheduleOpen = false;
	isReady = false;
	animState: any;
	currentPage = 2;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private dataService: DataService,
		private preferenceService: PreferenceService
	) {
		this.preferenceForm = this.fb.group({
			preferredDistribution: [[], [Validators.required]],
			maxDurationPerDay: [[], [Validators.required]],
		});
		this.scheduleOptions = this.dataService.getScheduleOptions();
		this.selectedScheduleOptions = [];
		this.durationOptions = this.dataService.getDurationOptions();
		this.selectedDurationOptions = [];
		this.animState = 'none';
	}
	get gf() {
		return this.preferenceForm.controls;
	}

	ngOnInit(): void { }
	next(): void {
		if (!this.preferenceForm.valid) return;
		this.preferenceService.next(this.preferenceForm.value, this.currentPage);
	}
	previous(): void { this.preferenceService.onPrevious(this.currentPage); }
	skip(): void { this.preferenceService.onSkip(this.currentPage); }
	remindLater(): void { this.preferenceService.onRemindLater(this.currentPage); }

	onSetSchedule(event: any): void { this.preferenceForm.patchValue({ preferredDistribution: event.selectedOptions }); }
	onSetDuration(event: any): void { this.preferenceForm.patchValue({ maxDurationPerDay: event.selectedOptions }); }
	onOpenSchedule(event: any): void { this.isScheduleOpen = true; }
	onCloseSchedule(event: any): void { this.isScheduleOpen = false; }

	captureStartEvent(event: AnimationEvent) { this.animState = 'anim-start'; }
	captureDoneEvent(event: AnimationEvent) { this.animState = 'anim-done'; setTimeout(() => { this.isReady = true; }, 400); }

}
