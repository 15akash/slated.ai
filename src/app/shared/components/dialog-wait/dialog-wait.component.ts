import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I_dialogData } from '../../services/dialog.service';


@Component({
	selector: 'app-dialog-wait',
	templateUrl: './dialog-wait.component.html',
	styleUrls: ['./dialog-wait.component.scss']
})
export class DialogWaitComponent implements OnInit {

	@Input() type: string = 'color-spinner';
	@Input() size: string = 'large';
	constructor(
		public dialogRef: MatDialogRef<DialogWaitComponent>,
		@Inject(MAT_DIALOG_DATA) public data: I_dialogData
	) { }

	ngOnInit(): void {
	}

}
