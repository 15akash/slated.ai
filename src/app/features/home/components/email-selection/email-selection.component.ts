import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I_option } from '@core/services/data.service';
import { I_people, I_peopleResponse, PeopleService } from '@core/services/people.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
	selector: 'app-email-selection',
	templateUrl: './email-selection.component.html',
	styleUrls: ['./email-selection.component.scss']
})
export class EmailSelectionComponent implements OnInit {
	searchForm!: FormGroup;

	maxDisplayEmails: number = 3;
	emailsCollapsed: boolean = true;

	@Input() placeholder: string = "Type a name or email to add";
	@Input() tabindex: number = 1;

	@Input() displayOptions: I_people[] = [];
	@Input() selectedItems: I_people[] = [];
	//displaySelectedItems: I_people[] = [];
	//@Input() selectedItem!: I_people;
	//previousItem: I_people = this.selectedItem;

	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	highlightId = '';
	highlightIdx: number = 0;
	isHoveringId = '';
	isMenuOpen = false;
	isHovering: boolean = false;
	isFocused: boolean = false;
	showWaiting: boolean = true;

	@ViewChild('inputCon') inputCon!: ElementRef;
	@ViewChild("scrollCon") scrollCon!: ElementRef;
	inputWidth: number = 0;

	@Output() select = new EventEmitter();
	@Output() remove = new EventEmitter();
	@Output() close = new EventEmitter();
	@Output() open = new EventEmitter();

	@Input() isMenuOpenOnInit: boolean = false;
	previousSearchString: string = "";
	pendingSearchString: string = "";
	searchTimer: any;

	constructor(
		fb: FormBuilder,
		private peopleService: PeopleService,
		private cdRef: ChangeDetectorRef,
		private snackBar: MatSnackBar,
		private clipboard: Clipboard
	) {
		this.searchForm = fb.group(
			{ searchString: ['', [Validators.required, Validators.email]] }
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
		this.collapseEmails();
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
		document.removeEventListener('keydown', this.onKeyDown);
	}
	onOpenMenu() {
		this.isMenuOpen = true;
		this.highlightIdx = 0;
		this.open.emit('open');
		this.onKeyDown = this.onKeyDown.bind(this);
		document.addEventListener('keydown', this.onKeyDown);
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
				//this.toggleValue(this.displayOptions[idx]);
				if (!this.gf.searchString.value) this.onSelect(this.displayOptions[idx], idx);
				else {
					if (this.gf.searchString.valid) this.onSelect({ _id: '-1', email: this.gf.searchString.value, photoUrl: '' }, -1);
					else this.menuTrigger.closeMenu();
				}
			} else if (e.key == 'Escape') {
				this.menuTrigger.closeMenu();
			} else if (e.key == 'Tab') {
				this.hideOptions();
			}
		}
	}
	scrollToIdx = (idx: number) => {
		let scrollH = idx > 3 ? (idx - 3) * 40 : 0;
		if (this.scrollCon) { this.scrollCon.nativeElement.scrollTo({ top: scrollH }); }
	}


	onFocus() {
		this.isFocused = true;
		this.isHovering = true;
	}
	onBlur() {
		this.isFocused = false;
		this.isHovering = false;
		this.collapseEmails();
	}

	clearSearch() {
		this.searchForm.patchValue({ searchString: "" });
	}
	updateDisplayOptions(searchString: string = "", open: boolean = true) {
		this.showWaiting = true;
		this.peopleService.getPeople(searchString).then((v: I_peopleResponse) => {
			this.showWaiting = false;
			this.displayOptions = v.people;
			if (open) {
				if (this.displayOptions.length) this.showOptions();
				else this.hideOptions();
			}
		}).catch(e => {
			this.showWaiting = false;
			console.log('error loading people');
		});
	}
	onMenuClick(e: MouseEvent) { e.stopPropagation(); }

	onSelect(item: I_people, index: number) {
		this.menuTrigger.closeMenu();
		//this.previousItem = this.selectedItem;
		//this.selectedItem = item;
		if (!this.checkAttendeeExists(item.email)) {
			this.selectedItems.push(item);
			this.highlightId = item._id || "";
			let displayName = "";//item.name || item.email;
			this.previousSearchString = displayName;
			this.searchForm.patchValue({ searchString: displayName });
			this.searchForm.patchValue({ searchString: "" });
			this.select.emit({ value: item, attendees: this.selectedItems });
		} else this.snackBar.open("Email already added", "Dismiss", { duration: 3000 });
	}
	checkAttendeeExists(email: string): boolean {
		let t = this.selectedItems, alreadyAdded = false;
		for (let i = 0, len = t.length; i < len; i++) {
			if (t[i].email == email) { alreadyAdded = true; break; }
		}
		return alreadyAdded;
	}
	removeAttendee(email: string): boolean {
		let t = this.selectedItems, newAttendees = [], success = false, removeIndex = -1;
		for (let i = 0, len = t.length; i < len; i++) {
			if (t[i].email == email) { success = true; }
			else newAttendees.push(t[i]);
		}
		this.selectedItems = newAttendees;
		this.remove.emit({ attendees: newAttendees });
		return success;
	}
	expandEmails(e: MouseEvent): void {
		e.preventDefault(); e.stopPropagation(); this.maxDisplayEmails = 10000; this.emailsCollapsed = false;
		//this.displaySelectedItems = this.selectedItems.slice(0, this.maxDisplayEmails);
	}
	collapseEmails(): void {
		this.maxDisplayEmails = 3; this.emailsCollapsed = true;
		//this.displaySelectedItems = this.selectedItems.slice(0, this.maxDisplayEmails);
	}
	onClickEmail(e: MouseEvent, item: I_people) { e.preventDefault(); e.stopPropagation(); }
	onClickCollapseEmails(e: MouseEvent) { e.preventDefault(); e.stopPropagation(); this.collapseEmails(); }
	onClickRemove(e: MouseEvent, item: I_people) {
		e.preventDefault(); e.stopPropagation();
		this.removeAttendee(item.email);
	}
	copyEmails(e: MouseEvent) {
		e.preventDefault(); e.stopPropagation();
		let text: string[] = [];
		this.selectedItems.map(x => { text.push(x.email) });
		if (text.length) {
			this.clipboard.copy(text.join(", "));
			this.snackBar.open("Emails copied to clipboard", "Dismiss", { duration: 3000 });
		}
	}

}
