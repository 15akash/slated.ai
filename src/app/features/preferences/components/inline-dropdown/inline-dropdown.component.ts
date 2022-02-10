import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataService, I_option } from '@core/services/data.service';

@Component({
	selector: 'app-inline-dropdown',
	templateUrl: './inline-dropdown.component.html',
	styleUrls: ['./inline-dropdown.component.scss']
})
export class InlineDropdownComponent implements AfterViewInit, OnInit, OnChanges {

	@Input() title: string = '';
	@Input() titleSuffix: string = '';
	@Input() placeholder: string = '';
	@Input() displayFn: string = '';
	@Input() hideClearAll: boolean = false;
	@Input() hideSelectAll: boolean = false;

	@Input() showSearch: boolean = false;
	searchString: string = "";

	@Input() tabindex: number = 1;
	@Input() maxSelect: number = 100000;
	@ViewChild('mouseCursor') mouseCursor!: ElementRef;
	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	@ViewChild("scrollCon") scrollCon!: ElementRef;
	@ViewChild("inlineInputHold") inlineInputHold!: ElementRef;

	optionForm!: FormGroup;
	@Input() options: I_option[] = [];
	@Input() selectedOptions: I_option[] = [];
	@Input() changedOptions: I_option[] = [];
	displayOptions: I_option[] = [];
	selectedOptionsInOrder: I_option[] = [];

	@Output() change = new EventEmitter();
	@Output() close = new EventEmitter();
	@Output() open = new EventEmitter();
	previousValue: any = {};
	selectionDisplayString: string = "";

	@Input() isMenuOpenOnInit: boolean = true;
	@Input() deferredMenuOpen: boolean = false;
	isMenuOpen: boolean = false;
	isFocused: boolean = false;
	highlightIdx: number = 0;

	constructor(
		private fb: FormBuilder,
		private dataService: DataService,
		private cd: ChangeDetectorRef
	) {
	}

	ngOnInit(): void {
		let formControls: any = {};
		let t: string[] = this.selectedOptions.map(x => { return x._id });
		this.displayOptions = this.options;
		this.displayOptions.forEach((item) => {
			formControls[item._id] = t.includes(item._id) ? true : false;
		});
		this.optionForm = this.fb.group(formControls);

		this.selectedOptions = this.getSelectedOptions();
		this.selectionDisplayString = this.getSelectionDisplay();
		this.selectedOptionsInOrder = this.selectedOptions.slice();
		this.previousValue = JSON.parse(JSON.stringify(this.optionForm.value));
	}
	ngAfterViewInit(): void {
		this.inlineInputHold.nativeElement.addEventListener('focus', (e: any) => {
			this.isFocused = true;
			if (!this.isMenuOpen) this.showOptions();
		});
		this.inlineInputHold.nativeElement.addEventListener('blur', (e: any) => {
			this.isFocused = false;
		});

		if (this.isMenuOpenOnInit) {
			//detectChanges required because menuTrigger is available only afterViewInit
			this.showOptions();
			this.cd.detectChanges();
		}
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.deferredMenuOpen && changes.deferredMenuOpen.currentValue && (changes.deferredMenuOpen.currentValue != changes.deferredMenuOpen.previousValue)) {
			this.showOptions();
			this.cd.detectChanges();
		} else if (changes.changedOptions && changes.changedOptions.currentValue && !changes.changedOptions.firstChange) {
			let newSelectedOptions = changes.changedOptions.currentValue;
			this.setAll(false, true);
			newSelectedOptions.forEach((item: I_option) => {
				this.setValue(item, true, true);
			});
		}
	}

	updateCursor(e: MouseEvent) {
		// this.mouseCursor.nativeElement.style.top = e.pageY + "px";
		// this.mouseCursor.nativeElement.style.left = e.pageX + "px";
	}
	showCursor() {
		// this.mouseCursor.nativeElement.style.display = 'block'; 
	}
	hideCursor() {
		// this.mouseCursor.nativeElement.style.display = 'none';
	}
	onMenuClick(e: MouseEvent) { e.stopPropagation(); }
	showOptions() { this.isMenuOpen = true; if (this.menuTrigger) this.menuTrigger.openMenu(); }
	hideOptions() { if (this.menuTrigger) this.menuTrigger.closeMenu(); }
	onCloseMenu() {
		this.isMenuOpen = false;
		this.close.emit('close');
		document.removeEventListener('keydown', this.onKeyDown);
	}
	onOpenMenu() {
		this.isMenuOpen = true;
		this.highlightIdx = 0;
		this.open.emit('open');
		this.onKeyDown = this.onKeyDown.bind(this);
		document.addEventListener('keydown', this.onKeyDown);
		setTimeout(() => {
			this.scrollToFirstSelected();
		}, 0);
	}

	setAll(checked: boolean, noEmit = false) {
		let formControls: any = {};
		this.options.forEach((item) => { formControls[item._id] = checked; });
		this.optionForm.setValue(formControls);
		this.onChange(checked, undefined, undefined, noEmit);
	}
	toggleValue(item: I_option, noEmit = false) {
		let v = this.optionForm.controls[item._id].value;
		this.optionForm.controls[item._id].patchValue(!v);
		this.onChange(!v, item);
	}
	setValue(item: I_option, value: boolean, noEmit = false) {
		this.optionForm.controls[item._id].patchValue(value);
		this.onChange(value, item, undefined, noEmit);
	}

	onChange(isChecked: boolean | void, item: I_option | void, index: number | void, noEmit = false) {
		this.forceMaxSelect(isChecked, item);
		this.selectedOptions = this.getSelectedOptions();
		this.selectionDisplayString = this.getSelectionDisplay();
		if (!noEmit) this.change.emit({
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
	forceMaxSelect(isChecked: boolean | void, item: I_option | void): void {
		if (!item) return;
		if (isChecked) this.selectedOptionsInOrder.push(item);
		else this.selectedOptionsInOrder = this.selectedOptionsInOrder.filter((x: I_option) => { return x._id != item._id });
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
	getSelectedOptions(): I_option[] {
		let selectedOptions: I_option[] = [];
		for (let i = 0, len = this.options.length; i < len; i++) {
			let _id = this.options[i]._id;
			if (this.optionForm.value[_id])
				selectedOptions.push(this.options[i]);
		}
		return selectedOptions;
	}
	getSelectionDisplay(): string {
		if (!this.selectedOptions.length) return "";
		else {
			if (this.displayFn == 'day') { return this.dataService.getDayDisplay(this.selectedOptions); }
			else if (this.displayFn == 'time') { return this.dataService.getTimeDisplay(this.selectedOptions); }
			else if (this.displayFn == 'activity') { return "select activity"; }
			else {
				let t: string[] = [];
				this.selectedOptions.forEach(x => { t.push(x.displayName.toLowerCase()); })
				return t.join(', ');
			}
		}
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
				if (!this.showSearch) this.hideOptions();
				else {
					if (!!this.selectedOptions.length) this.hideOptions();
				}
			}
		}
	}
	scrollToIdx = (idx: number) => {
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
				return x.displayName.toLowerCase().includes(searchString.toLowerCase())
			});
			this.displayOptions = t;
		} else this.displayOptions = this.options;
	}

}
