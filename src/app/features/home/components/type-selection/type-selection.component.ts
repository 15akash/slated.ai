import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { I_option } from '@core/services/data.service';
import { I_meetingTypeResponse, MeetingService } from '@core/services/meeting.service';

@Component({
	selector: 'app-type-selection',
	templateUrl: './type-selection.component.html',
	styleUrls: ['./type-selection.component.scss']
})
export class TypeSelectionComponent implements OnInit, OnChanges, AfterViewChecked {
	searchForm!: FormGroup;

	@Input() placeholder: string = "What kind of meeting?";
	@Input() tabindex: number = 1;

	@Input() displayOptions: I_option[] = [];
	@Input() selectedItem!: I_option;
	previousItem: I_option = this.selectedItem;

	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	highlightId = '';
	isHoveringId = '';
	isMenuOpen = false;
	isHovering: boolean = false;
	isFocused: boolean = false;
	showWaiting: boolean = true;

	@ViewChild('inputCon') inputCon!: ElementRef;
	inputWidth: number = 0;

	@Output() select = new EventEmitter();
	@Output() clear = new EventEmitter();
	@Output() close = new EventEmitter();
	@Output() open = new EventEmitter();

	@Input() isMenuOpenOnInit: boolean = false;
	previousSearchString: string = "";
	pendingSearchString: string = "";
	searchTimer: any;

	constructor(
		fb: FormBuilder,
		private meetingService: MeetingService,
		private cdRef: ChangeDetectorRef
	) {
		this.searchForm = fb.group(
			{ searchString: ['', [Validators.required]] }
		);
		this.gf.searchString.valueChanges.subscribe(value => {
			if (value !== this.previousSearchString) {
				if (this.searchTimer) {
					this.pendingSearchString = value;
					return;
				} else this.pendingSearchString = "";

				this.previousSearchString = value;
				this.updateDisplayOptions(value);
				this.searchTimer = setTimeout(() => {
					if (this.pendingSearchString) {
						this.updateDisplayOptions(this.pendingSearchString);
						this.pendingSearchString = "";
					}
					clearTimeout(this.searchTimer);
					this.searchTimer = undefined;
				}, 1000);
			}
		});
		this.updateDisplayOptions("", this.isMenuOpenOnInit);
	}
	get gf() { return this.searchForm.controls; }
	ngOnInit(): void {
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.selectedItem) {
			if (changes.selectedItem.currentValue != changes.selectedItem.previousValue) {
				this.previousSearchString = this.selectedItem?.displayName || "";
				this.searchForm.patchValue({ searchString: this.selectedItem?.displayName || "" });
			}
		}
	}
	ngAfterViewChecked(): void {
		if (this.inputCon) {
			this.inputWidth = this.inputCon.nativeElement.offsetWidth;
		}
		this.cdRef.detectChanges();
	}

	showOptions() { this.isMenuOpen = true; if (this.menuTrigger) this.menuTrigger.openMenu(); }
	hideOptions() { if (this.menuTrigger) this.menuTrigger.closeMenu(); }
	onCloseMenu() {
		this.isMenuOpen = false;
		this.close.emit('close');
		// document.removeEventListener('keydown', this.onKeyDown);
	}
	onOpenMenu() {
		this.isMenuOpen = true;
		// this.highlightIdx = 0;
		this.open.emit('open');
		// this.onKeyDown = this.onKeyDown.bind(this);
		// document.addEventListener('keydown', this.onKeyDown);
		// setTimeout(() => {
		// 	this.scrollToFirstSelected();
		// }, 0);
	}

	onFocus() {
		this.isFocused = true;
		this.isHovering = true;
	}
	onBlur() {
		this.isFocused = false;
		this.isHovering = false;
	}

	clearSearch() {
		this.searchForm.patchValue({ searchString: "" });
		this.clear.emit('clear');
	}
	updateDisplayOptions(searchString: string = "", open: boolean = true) {
		this.showWaiting = true;
		this.meetingService.getMeetingType(searchString).then((v: I_meetingTypeResponse) => {
			this.showWaiting = false;
			this.displayOptions = v.meetingTypes;
			if (open) {
				if (this.displayOptions.length) this.showOptions();
				else this.hideOptions();
			}
		}).catch(e => {
			this.showWaiting = false;
			console.log('error loading meeting types');
		});
	}
	onMenuClick(e: MouseEvent) { e.stopPropagation(); }

	onSelect(item: I_option, index: number) {
		this.menuTrigger.closeMenu();
		this.previousItem = this.selectedItem;
		this.selectedItem = item;
		this.highlightId = item._id;
		this.previousSearchString = item.displayName;
		this.searchForm.patchValue({ searchString: item.displayName });
		this.select.emit({ value: item, previousValue: this.previousItem });
	}
}
