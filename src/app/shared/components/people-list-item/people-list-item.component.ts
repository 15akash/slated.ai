import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { I_option } from '@core/services/data.service';
import { I_people } from '@core/services/people.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalKey, LocalStorageService } from '@core/services/local-storage.service';

@Component({
	selector: 'app-people-list-item',
	templateUrl: './people-list-item.component.html',
	styleUrls: ['./people-list-item.component.scss']
})
export class PeopleListItemComponent implements OnInit {
	@Input() data!: I_people;
	@Input() notEditable = false;
	@Input() nonRemovable: boolean = false;
	@Input() displayType: string = 'no-border';
	@Input() showStatus: boolean = false;

	isMenuOpen = false;
	moreOptions: I_option[] = [
		// { _id: 'profile', displayName: 'Open profile', icon: 'account' },
		// { _id: '2', displayName: 'Send email', icon: 'messages' },
		{ _id: 'copy', displayName: 'Copy email', icon: 'copy' },
		{ _id: 'delete', displayName: 'Remove', icon: 'delete' }
	];
	selectedItem: I_option = this.moreOptions[0];
	previousItem: I_option = this.selectedItem;
	@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
	@Output() select = new EventEmitter();
	@Output() change = new EventEmitter();

	constructor(
		private snackBar: MatSnackBar,
		private localStorageService: LocalStorageService
	) {
	}

	ngOnInit(): void {
		if (this.notEditable) this.nonRemovable = true;
		if (this.nonRemovable) {
			this.moreOptions = this.moreOptions.filter(x => { return x._id !== 'delete' });
		}
	}
	onOpenMenu(): void {
		this.isMenuOpen = true;
	}
	onCloseMenu(): void {
		this.isMenuOpen = false;
	}
	onMenuClick(e: MouseEvent): void {
		e.stopPropagation();
	}
	onMoreItemSelect(item: I_option, index: number) {
		this.menuTrigger.closeMenu();
		this.previousItem = this.selectedItem;
		this.selectedItem = item;
		this.change.emit({ value: item, data: this.data, previousValue: this.previousItem });
		if (item._id == 'copy') this.copyEmail();
	}
	onSelect(): void {
		this.select.emit({ action: 'selected', data: {} });
	}

	copyEmail() {
		navigator.permissions.query({ name: "clipboard-write" }).then(result => {
			if (result.state == "granted" || result.state == "prompt") {
				this.updateClipboard(this.data.email, "Email copied to clipboard");
			} else this.openSnackBar("Do not have clipboard permissions", "Dismiss");
		});
	}
	updateClipboard(newClip: any, msg: string) {
		navigator.clipboard.writeText(newClip).then(() => {
			/* clipboard successfully set */
			this.openSnackBar(msg, "Dismiss");
		}, () => {
			/* clipboard write failed */
			this.openSnackBar("Failed to copy to clipboard", "Dismiss");
		});
	}
	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, { duration: 3000 });
	}

}
