import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { DataService, I_hourOption, I_option } from '@core/services/data.service';
import { fader, slider } from 'src/app/route-animations';
import { PreferenceService } from '../../services/preference.service';

@Component({
	selector: 'app-preference1',
	templateUrl: './preference1.component.html',
	styleUrls: ['./preference1.component.scss'],
	animations: [slider],
	host: {
		'[@routeAnimations]': 'animState',
		'(@routeAnimations.start)': 'captureStartEvent($event)',
		'(@routeAnimations.done)': 'captureDoneEvent($event)',
	}
})
export class Preference1Component implements OnInit {
	public preferenceForm: FormGroup;
	dayOptions: I_option[] = [];
	selectedDayOptions: I_option[] = [];
	hourOptions: I_hourOption[] = [];
	selectedTimeOptions: I_option[] = [];
	isDayOpen = false;
	isReady = false;
	animState: any;
	currentPage = 1;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private dataService: DataService,
		private apiService: ApiService,
		private snackBar: MatSnackBar,
		private preferenceService: PreferenceService
	) {
		this.preferenceForm = this.fb.group({
			preferredDays: [[], [Validators.required]],
			preferredHours: [[], [Validators.required]],
		});
		this.dayOptions = this.dataService.getDayOptions();
		this.selectedDayOptions = [];
		this.hourOptions = this.dataService.getHourOptions();
		this.selectedTimeOptions = [];
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

	onSetDay(event: any): void { this.preferenceForm.patchValue({ preferredDays: event.selectedOptions }); }
	onSetTime(event: any): void { this.preferenceForm.patchValue({ preferredHours: event.selectedOptions }); }
	onOpenDay(event: any): void { this.isDayOpen = true; }
	onCloseDay(event: any): void { this.isDayOpen = false; }

	captureStartEvent(event: AnimationEvent) { this.animState = 'anim-start'; }
	captureDoneEvent(event: AnimationEvent) { this.animState = 'anim-done'; setTimeout(() => { this.isReady = true; }, 400); }

}
