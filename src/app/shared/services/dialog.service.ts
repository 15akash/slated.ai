import { ChangeDetectorRef, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogWaitComponent, DialogBoxComponent } from 'src/app/shared/components';

export interface I_dialogData {
	title: string;
	msg?: string;
	link?: string;
	btns?: I_btnType[]
}
export interface I_btnType {
	type: string,
	btnTitle: string,
	callback?: any
}
export interface I_waitData {
	title?: string;
	msg?: string;
}

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	isWaiting = false;
	waitRef!: MatDialogRef<DialogWaitComponent>;

	constructor(
		public dialog: MatDialog,
		public waitDialog: MatDialog
	) { }
	showWait(data: I_waitData): void {
		if (this.isWaiting) return; this.isWaiting = true;
		this.waitRef = this.waitDialog.open(DialogWaitComponent, {
			width: '100vw', height: '100vh', data: data
		});
	}
	closeWait(): void {
		if (!this.isWaiting) return;
		this.waitRef.close();
		this.isWaiting = false;
	}
	openDialog(data: I_dialogData): void {
		let w = window.innerWidth * 0.3;
		w = w < 300 ? w * 0.95 : (w > 400 ? 400 : w);
		const dialogRef = this.dialog.open(DialogBoxComponent, {
			width: w + 'px',
			data: data,
			panelClass: 'slated-dialog-box'
		});
		dialogRef.afterClosed()
			.subscribe(result => {
				console.log('dialog box closed with result=', result);
			});
	}

}
