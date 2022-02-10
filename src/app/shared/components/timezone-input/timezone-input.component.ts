import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';
import { I_timeZone, I_timeZoneResponse, TimezoneService } from '@core/services/timezone.service';

@Component({
	selector: 'app-timezone-input',
	templateUrl: './timezone-input.component.html',
	styleUrls: ['./timezone-input.component.scss']
})
export class TimezoneInputComponent implements AfterViewInit, OnInit {

	@Input() placeholder: string = 'Add timezone';
	@Input() displayFn: string = '';
	searchString: string = "";

	@Input() tabindex: number = 1;

	@Input() maxSelect: number = 1;
	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	@ViewChild("scrollCon") scrollCon!: ElementRef;
	@ViewChild("inlineInputHold") inlineInputHold!: ElementRef;
	@ViewChild("timezoneInput") timezoneInput!: ElementRef;

	optionForm!: FormGroup;
	@Input() options: I_timeZone[] = [];
	@Input() selectedOptions: I_timeZone[] = [];
	displayOptions: I_timeZone[] = [];
	selectedOptionsInOrder: I_timeZone[] = [];

	@Output() change = new EventEmitter();
	@Output() close = new EventEmitter();
	@Output() open = new EventEmitter();
	previousValue: any = {};
	selectionDisplayString: string = "";
	selectionDisplayString1: string = "";
	selectionDisplayString2: string = "";
	selectionDisplayString3: string = "";

	@Input() isMenuOpenOnInit: boolean = false;
	isMenuOpen: boolean = false;
	isFocused: boolean = false;
	highlightIdx: number = 0;

	constructor(
		private timezoneService: TimezoneService,
		private localStorageService: LocalStorageService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.optionForm = this.fb.group({});
		let timeZones = this.localStorageService.getLocal(LocalKey.timeZones);
		let defaultTimeZone = this.localStorageService.getLocal(LocalKey.defaultTimeZone);
		if (timeZones && timeZones.length && defaultTimeZone) {
			this.initForm(timeZones, defaultTimeZone);
			return;
		}
		this.timezoneService.getTimeZones().then((v: I_timeZoneResponse) => {
			console.log('timezones2=', v);
			this.initForm(v.timeZones, v.defaultTimeZone);
		}).catch(e => {
			console.log('error loading timezone');
		});
	}
	ngAfterViewInit(): void {
		this.inlineInputHold.nativeElement.addEventListener('focus', (e: any) => {
			this.isFocused = true;
			if (!this.isMenuOpen) this.showOptions();
			this.onKeyDown = this.onKeyDown.bind(this);
			document.addEventListener('keydown', this.onKeyDown);
		});
		this.inlineInputHold.nativeElement.addEventListener('blur', (e: any) => {
			this.isFocused = false;
			document.removeEventListener('keydown', this.onKeyDown);
		});

		if (this.isMenuOpenOnInit) {
			//detectChanges required because menuTrigger is available only afterViewInit
			this.showOptions();
			this.cd.detectChanges();
		}
	}

	initForm(timeZones: I_timeZone[], defaultTimeZone: I_timeZone): void {

		this.options = timeZones;
		this.selectedOptions = [defaultTimeZone];

		let formControls: any = {};
		let t: string[] = this.selectedOptions.map(x => { return x._id });
		this.displayOptions = this.options.slice();
		this.displayOptions.forEach((item) => {
			formControls[item._id] = t.includes(item._id) ? true : false;
			item.displayGMT = this.timezoneService.getGMTDisplay(item);
			item.displayLocalCurrentTime = this.timezoneService.getLocalCurrentTime(item);
		});
		this.optionForm = this.fb.group(formControls);

		this.selectedOptions = this.getSelectedOptions();
		this.updateSelectionDisplay();
		this.selectedOptionsInOrder = this.selectedOptions.slice();
		this.previousValue = JSON.parse(JSON.stringify(this.optionForm.value));

	}

	onMenuClick(e: MouseEvent) { e.stopPropagation(); }
	showOptions() { this.isMenuOpen = true; if (this.menuTrigger) this.menuTrigger.openMenu(); }
	hideOptions() { if (this.menuTrigger) this.menuTrigger.closeMenu(); }
	onCloseMenu() {
		this.isMenuOpen = false;
		this.close.emit('close');
		//document.removeEventListener('keydown', this.onKeyDown);
	}
	onOpenMenu() {
		this.isMenuOpen = true;
		this.highlightIdx = 0;
		this.scrollToFirstSelected();
		this.open.emit('open');
		// this.onKeyDown = this.onKeyDown.bind(this);
		// document.addEventListener('keydown', this.onKeyDown);
	}

	setAll(checked: boolean) {
		let formControls: any = {};
		this.options.forEach((item) => { formControls[item._id] = checked; });
		this.optionForm.setValue(formControls);
		this.onChange();
	}
	toggleValue(item: I_timeZone) {
		let v = this.optionForm.controls[item._id].value;
		this.optionForm.controls[item._id].patchValue(!v);
		this.onChange(!v, item);
	}
	onChange(isChecked: boolean | void, item: I_timeZone | void, index: number | void) {
		this.forceMaxSelect(isChecked, item);
		this.selectedOptions = this.getSelectedOptions();
		//this.selectionDisplayString = this.getSelectionDisplay();
		this.updateSelectionDisplay();
		this.change.emit({
			selectedOptions: this.selectedOptions,
			value: this.optionForm.value,
			previousValue: JSON.parse(JSON.stringify(this.previousValue)),
			changedOption: item,
			action: isChecked ? 'checked' : 'unchecked'
		});
		this.previousValue = JSON.parse(JSON.stringify(this.optionForm.value));
		this.highlightIdx = index != undefined ? index : this.highlightIdx;
		if (this.maxSelect == this.selectedOptions.length || this.selectedOptions.length == this.options.length) {
			this.hideOptions();
		}
	}
	forceMaxSelect(isChecked: boolean | void, item: I_timeZone | void): void {
		if (!item) return;
		if (isChecked) this.selectedOptionsInOrder.push(item);
		else this.selectedOptionsInOrder = this.selectedOptionsInOrder.filter((x: I_timeZone) => { return x._id != item._id });
		if (this.selectedOptionsInOrder.length > this.maxSelect) {
			this.selectedOptionsInOrder = this.selectedOptionsInOrder.slice(-this.maxSelect);
			let selectedIds = this.selectedOptionsInOrder.map(x => { return x._id });
			for (let _id in this.optionForm.value) {
				if (selectedIds.indexOf(_id) >= 0) {
					this.optionForm.controls[_id].patchValue(true);
				} else {
					this.optionForm.controls[_id].patchValue(false);
				}
			}
		}
	}
	getSelectedOptions(): I_timeZone[] {
		let selectedOptions: I_timeZone[] = [];
		for (let i = 0, len = this.options.length; i < len; i++) {
			let _id = this.options[i]._id;
			if (this.optionForm.value[_id])
				selectedOptions.push(this.options[i]);
		}
		return selectedOptions;
	}
	getSelectionDisplay(): string {
		if (!this.selectedOptions.length) return '';
		else {
			let tz = this.selectedOptions[0];
			if (this.displayFn == 'gmt') { return this.timezoneService.getGMTDisplay(tz); }
			else if (this.displayFn == 'fullname') { return ''; }
			else {
				return tz.abbreviation + ' . ' + this.timezoneService.getGMTDisplay(tz) + ' . ' + this.timezoneService.getLocalCurrentTime(tz);
			}
		}
	}
	updateSelectionDisplay(): any {
		if (!this.selectedOptions.length) return '';
		let tz = this.selectedOptions[0];
		this.selectionDisplayString1 = tz.abbreviation;
		this.selectionDisplayString2 = this.timezoneService.getLocalCurrentTime(tz)
		//this.selectionDisplayString1 = this.timezoneService.getGMTDisplay(tz);
		//this.selectionDisplayString2 = tz.abbreviation;
		//this.selectionDisplayString3 = this.timezoneService.getLocalCurrentTime(tz)
	}
	onKeyDown(e: KeyboardEvent) {
		if (!this.isMenuOpen) {
			if (this.isFocused && e.key == 'Enter') {
				this.showOptions();
			}
		} else {
			let idx = this.highlightIdx;
			if (e.key == 'ArrowUp') {
				if (idx > 0) idx--; else idx = 0;
				this.highlightIdx = idx;
				this.scrollToIdx(this.highlightIdx);
			} else if (e.key == 'ArrowDown') {
				if (idx < this.displayOptions.length - 1) idx++; else idx = this.displayOptions.length - 1;
				this.highlightIdx = idx;
				this.scrollToIdx(this.highlightIdx);
			} else if (e.key == 'Enter') {
				this.toggleValue(this.displayOptions[idx]);
			} else if (e.key == 'Escape') {
				this.menuTrigger.closeMenu();
			} else if (e.key == 'Tab') {
				if (!!this.selectedOptions.length) this.hideOptions();
			}
		}
	}
	scrollToIdx(idx: number) {
		let scrollH = idx > 3 ? (idx - 3) * 40 : 0;
		if (this.scrollCon) { this.scrollCon.nativeElement.scrollTo({ top: scrollH }); }
	}
	scrollToFirstSelected(): void {
		if (this.selectedOptions.length) {
			let idx = -1, firstSelected = this.selectedOptions[0];
			for (let i = 0, len = this.displayOptions.length; i < len; i++) {
				if (this.displayOptions[i]._id == firstSelected._id) { idx = i; break; }
			}
			if (idx >= 0) {
				this.highlightIdx = idx;
				this.scrollToIdx(idx);
			}
		}
	}

	onSearch(searchString: string) {
		if (searchString && typeof searchString == 'string') {
			this.searchString = searchString;
			let t = this.options.filter(x => {
				return x.displayText.toLowerCase().includes(searchString.toLowerCase())
			});
			this.displayOptions = t;
		} else this.displayOptions = this.options;
	}

}
