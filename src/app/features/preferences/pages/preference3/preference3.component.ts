import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, I_option } from '@core/services/data.service';
import { fader, slider } from 'src/app/route-animations';
import { PreferenceService } from '../../services/preference.service';

@Component({
	selector: 'app-preference3',
	templateUrl: './preference3.component.html',
	styleUrls: ['./preference3.component.scss'],
	animations: [slider],
	host: {
		'[@routeAnimations]': 'animState',
		'(@routeAnimations.start)': 'captureStartEvent($event)',
		'(@routeAnimations.done)': 'captureDoneEvent($event)',
	}
})
export class Preference3Component implements OnInit {
	public preferenceForm: FormGroup;
	hourOptions: I_option[] = [];
	selectedTimeOptions: I_option[] = [];
	durationOptions: I_option[] = [];
	selectedDurationOptions: I_option[] = [];
	isTimeOpen = false;
	isReady = false;
	animState: any;
	currentPage = 3;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private dataService: DataService,
		private preferenceService: PreferenceService
	) {
		this.preferenceForm = this.fb.group({
			productiveHours: [[], [Validators.required]],
			minFocusTimePerWeek: [[], [Validators.required]],
		});
		this.hourOptions = this.dataService.getHourOptions();
		this.selectedTimeOptions = [];
		this.durationOptions = this.dataService.getFocusDurationOptions();
		this.selectedDurationOptions = [];
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


	onSetTime(event: any): void { this.preferenceForm.patchValue({ productiveHours: event.selectedOptions }); }
	onSetDuration(event: any): void { this.preferenceForm.patchValue({ minFocusTimePerWeek: event.selectedOptions }); }
	onOpenTime(event: any): void { this.isTimeOpen = true; }
	onCloseTime(event: any): void { this.isTimeOpen = false; }

	captureStartEvent(event: AnimationEvent) { this.animState = 'anim-start'; }
	captureDoneEvent(event: AnimationEvent) { this.animState = 'anim-done'; setTimeout(() => { this.isReady = true; }, 400); }
}
