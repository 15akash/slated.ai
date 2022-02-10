import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { I_timeslot } from '@core/services/meeting.service';
import { formatDay, formatDisplayDate, formatDisplayTime, formatDuration } from '@core/utils/utils';

@Component({
	selector: 'app-time-slot',
	templateUrl: './time-slot.component.html',
	styleUrls: ['./time-slot.component.scss']
})
export class TimeSlotComponent implements OnInit {

	@Input() data!: I_timeslot;
	@Input() theme: string = 'light';
	@Input() type: string = '';
	@Input() notEditable: boolean = false;
	timeDisplay: string = "10am, Mon - 15 min";
	dateDisplay: string = "Feb 1, '22";

	@Input() isSelected: boolean = false;
	@Output() select = new EventEmitter();
	@Output() confirm = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		let t1 = new Date(this.data.startDtStr);
		let t2 = new Date(this.data.endDtStr);
		let duration = formatDuration((t2.getTime() - t1.getTime()) / (60 * 60 * 1000), this.type == 'email' ? 'medium' : 'long');
		this.timeDisplay = formatDisplayTime(t1) + ", " + formatDay(t1) + " - " + duration;
		this.dateDisplay = formatDisplayDate(t1, "shortMonth date, 'shortYear");
	}
	onSelect(e: any) {
		if (this.notEditable) return;
		this.data.isSelected = !this.data.isSelected;
		this.select.emit({ value: this.data.isSelected, data: this.data });
	}
	onConfirm(e: MouseEvent) {
		e.preventDefault(); e.stopPropagation();
		this.confirm.emit({ data: this.data });
	}

}
