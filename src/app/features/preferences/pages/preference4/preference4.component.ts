import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, I_option } from '@core/services/data.service';
import { fader, slider } from 'src/app/route-animations';
import { PreferenceService } from '../../services/preference.service';

@Component({
	selector: 'app-preference4',
	templateUrl: './preference4.component.html',
	styleUrls: ['./preference4.component.scss'],
	animations: [slider],
	host: {
		'[@routeAnimations]': 'animState',
		'(@routeAnimations.start)': 'captureStartEvent($event)',
		'(@routeAnimations.done)': 'captureDoneEvent($event)',
	}

})
export class Preference4Component implements OnInit {
	public preferenceForm: FormGroup;
	workOptions: I_option[] = [];
	selectedWorkOptions: I_option[] = [];
	roleOptions: I_option[] = [];
	selectedRoleOptions: I_option[] = [];
	isWorkOpen = false;
	isRoleOpen = false;
	isReady = false;
	animState: any;
	currentPage = 4;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private dataService: DataService,
		private preferenceService: PreferenceService
	) {
		this.preferenceForm = this.fb.group({
			workRole: [[], [Validators.required]],
			workIndustry: [[], [Validators.required]],
		});
		this.workOptions = this.dataService.getWorkOptions();
		this.selectedWorkOptions = [];
		this.roleOptions = this.dataService.getRoleOptions();
		this.selectedRoleOptions = [];
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

	onSetWork(event: any): void { this.preferenceForm.patchValue({ workIndustry: event.selectedOptions }); }
	onSetRole(event: any): void { this.preferenceForm.patchValue({ workRole: event.selectedOptions }); }
	onOpenWork(event: any): void { this.isWorkOpen = true; }
	onCloseWork(event: any): void { this.isWorkOpen = false; }
	onOpenRole(event: any): void { this.isRoleOpen = true; }
	onCloseRole(event: any): void { this.isRoleOpen = false; }

	captureStartEvent(event: AnimationEvent) { this.animState = 'anim-start'; }
	captureDoneEvent(event: AnimationEvent) { this.animState = 'anim-done'; setTimeout(() => { this.isReady = true; }, 400); }

}
