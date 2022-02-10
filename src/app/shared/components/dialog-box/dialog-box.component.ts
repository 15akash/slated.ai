import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I_btnType, I_dialogData } from '../../services/dialog.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
	selector: 'app-dialog-box',
	templateUrl: './dialog-box.component.html',
	styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<DialogBoxComponent>,
		@Inject(MAT_DIALOG_DATA) public data: I_dialogData,
		private snackBar: MatSnackBar,
		private clipboard: Clipboard,
	) { }

	ngOnInit(): void {
	}
	onNoClick(): void {
		this.dialogRef.close("close");
	}
	onBtnClick(btnData: I_btnType) {
		if (btnData.callback) btnData.callback();
		this.dialogRef.close();
	}
	copyLink(e: MouseEvent) {
		console.log(e);
		this.clipboard.copy(this.data.link || "");
		this.snackBar.open("Link copied to clipboard", "Dismiss", { duration: 3000 });
	}

}
