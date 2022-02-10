import { Injectable } from '@angular/core';
import { formatDisplayTime } from '@core/utils/utils';


export interface I_option {
	_id: string,
	displayName: string,
	shortName?: string,
	selectedDisplayText?: string,
	value?: number | string,
	defaultStartHour?: number,
	defaultDuration?: number,
	icon?: string, highlightIcon?: string,
	disabled?: boolean
};
export interface I_hourOption {
	_id: string,
	displayName: string,
	fromHour: number,
	tillHour: number
}

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor() { }
	getDayOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '0', displayName: "Sunday", value: 0 },
			{ _id: '1', displayName: "Monday", value: 1 },
			{ _id: '2', displayName: "Tuesday", value: 2 },
			{ _id: '3', displayName: "Wednesday", value: 3 },
			{ _id: '4', displayName: "Thursday", value: 4 },
			{ _id: '5', displayName: "Friday", value: 5 },
			{ _id: '6', displayName: "Saturday", value: 6 }
		];
		return a;
	}
	getDayDisplay(options: I_option[]): string {
		let t: string[] = [], t_short: string[] = [];
		options.forEach(x => {
			t.push(x.displayName.toLowerCase());
			t_short.push(x.displayName.toLowerCase().substring(0, 3))
		})
		let s = t.join(', '), s_short = t_short.join(', ');
		if (t.length == 7) return 'all days';
		else if (s.includes('sunday') && s.includes('saturday') && t.length == 2) return 'weekends';
		else if (!s.includes('sunday') && !s.includes('saturday') && t.length == 5) return 'weekdays';
		else if (t.length >= 3) {
			return s_short;
		} else return s;
	}
	getHourOptions(): I_hourOption[] {
		let a: I_hourOption[] = [
			{ _id: '0', displayName: 'early morning (6-8am)', fromHour: 6, tillHour: 8 },
			{ _id: '1', displayName: 'morning (8-10am)', fromHour: 8, tillHour: 10 },
			{ _id: '2', displayName: 'late morning (10am-12pm)', fromHour: 10, tillHour: 12 },
			{ _id: '3', displayName: 'noon (12-2pm)', fromHour: 12, tillHour: 14 },
			{ _id: '4', displayName: 'late noon (2-4pm)', fromHour: 14, tillHour: 16 },
			{ _id: '5', displayName: 'evening (4-6pm)', fromHour: 16, tillHour: 18 },
			{ _id: '6', displayName: 'late evening (6-8pm)', fromHour: 18, tillHour: 20 },
			{ _id: '7', displayName: 'night (8-10pm)', fromHour: 20, tillHour: 22 },
			{ _id: '8', displayName: 'late night (10pm-12am)', fromHour: 22, tillHour: 24 },
			{ _id: '9', displayName: 'red eye (12-6am)', fromHour: 0, tillHour: 6 }
		];
		return a;
	}
	getTimeDisplay(options: I_option[]): string {
		let t: string[] = [];
		options.forEach(x => {
			t.push(x.displayName.toLowerCase());
		})
		let s = t.join(', ');
		if (t.length == 10) return 'any time';
		else return s;
	}
	getScheduleOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '0', displayName: "Back to back", value: 0 },
			{ _id: '1', displayName: "Scattered", value: 1 },
		];
		return a;
	}
	getDurationOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '1', displayName: "1 hour", value: 1 },
			{ _id: '2', displayName: "2 hours", value: 2 },
			{ _id: '3', displayName: "3 hours", value: 3 },
			{ _id: '4', displayName: "4 hours", value: 4 },
			{ _id: '5', displayName: "5 hours", value: 5 },
			{ _id: '6', displayName: "6 hours", value: 6 },
			{ _id: '7', displayName: "7 hours", value: 7 },
			{ _id: '8', displayName: "8 hours", value: 8 },
		];
		return a;
	}
	getFocusDurationOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '1', displayName: "5 hours (1 hr/day for 5 days)", value: 1 },
			{ _id: '2', displayName: "10 hours (2 hrs/day)", value: 2 },
			{ _id: '3', displayName: "15 hours (3 hrs/day)", value: 3 },
			{ _id: '4', displayName: "20 hours (4 hrs/day)", value: 4 },
			{ _id: '5', displayName: "25 hours (5 hrs/day)", value: 5 },
			{ _id: '6', displayName: "30 hours (6 hrs/day)", value: 6 },
			{ _id: '7', displayName: "35 hours (7 hrs/day)", value: 7 },
			{ _id: '8', displayName: "40 hours (8 hrs/day)", value: 8 },
		];
		return a;
	}

	getWorkOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '1', displayName: 'Education' },
			{ _id: '2', displayName: 'Manufacturing & Construction' },
			{ _id: '3', displayName: 'IT/Technology' },
			{ _id: '4', displayName: 'Biotechnology' },
			{ _id: '5', displayName: 'E-commerce' },
			{ _id: '6', displayName: 'Transport & Logistics' },
			{ _id: '7', displayName: 'Travel, Hotels & Hospitality' },
			{ _id: '8', displayName: 'Fashion' },
			{ _id: '9', displayName: 'Retail and Wholesale' },
			{ _id: '10', displayName: 'Finance' },
			{ _id: '11', displayName: 'Media & Communications' },
			{ _id: '12', displayName: 'Business Services' },
			{ _id: '13', displayName: 'Non-profit or Social services' },
			{ _id: '14', displayName: 'Hospital & related' },
			{ _id: '15', displayName: 'Law' },
			{ _id: '16', displayName: 'Federal' },
			{ _id: '17', displayName: 'Other' }
		];
		return a;
	}
	getRoleOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '1', displayName: 'Board of Director' },
			{ _id: '2', displayName: 'Business Owner/ CEO' },
			{ _id: '3', displayName: 'Other C-level/Equivalent' },
			{ _id: '4', displayName: 'Director/VP/Equivalent' },
			{ _id: '5', displayName: 'Manager/ Team Leader' },
			{ _id: '6', displayName: 'Team Member/Staff' },
			{ _id: '7', displayName: 'Independent professional' },
			{ _id: '8', displayName: 'Freelancer' },
			{ _id: '9', displayName: 'Student' },
			{ _id: '10', displayName: 'Full time mother/father' },
			{ _id: '11', displayName: 'Multiple Jobs' },
			{ _id: '12', displayName: 'Parent' }
		];
		return a;
	}

	getActivityOptions(excludeOptions: I_option[] | void): I_option[] {
		let a: I_option[] = [
			{ _id: '1', value: 'sleep', displayName: 'Sleep', selectedDisplayText: 'sleep', defaultStartHour: 22, defaultDuration: 480, icon: 'sleep' },
			{ _id: '2', value: 'morning-commute', displayName: 'Morning commute', selectedDisplayText: 'commute to work', defaultStartHour: 9, defaultDuration: 45, icon: 'commute-to-work' },
			{ _id: '3', value: 'evening-commute', displayName: 'Evening commute', selectedDisplayText: 'commute back to home', defaultStartHour: 17, defaultDuration: 45, icon: 'commute-to-home' },
			{ _id: '4', value: 'breakfast', displayName: 'Breakfast', selectedDisplayText: 'eat breakfast', defaultStartHour: 8, defaultDuration: 30, icon: 'breakfast' },
			{ _id: '5', value: 'lunch', displayName: 'Lunch', selectedDisplayText: 'eat lunch', defaultStartHour: 13, defaultDuration: 60, icon: 'lunch' },
			{ _id: '6', value: 'dinner', displayName: 'Dinner', selectedDisplayText: 'eat dinner', defaultStartHour: 19, defaultDuration: 60, icon: 'dinner' },
			{ _id: '7', value: 'morning-workout', displayName: 'Morning work out', selectedDisplayText: 'work out', defaultStartHour: 6, defaultDuration: 60, icon: 'work-out' },
			{ _id: '8', value: 'evening-workout', displayName: 'Evening work out', selectedDisplayText: 'work out', defaultStartHour: 18, defaultDuration: 60, icon: 'work-out' },
			{ _id: '9', value: 'prayer', displayName: 'Yoga/Meditate/Pray', selectedDisplayText: 'do yoga/meditate/pray', defaultStartHour: 6, defaultDuration: 45, icon: 'pray' },
			{ _id: '10', value: 'rest', displayName: 'Rest/Nap', selectedDisplayText: 'rest/nap', defaultStartHour: 14, defaultDuration: 20, icon: 'rest' },
			{ _id: '11', value: 'break', displayName: 'Tea/Coffee break', selectedDisplayText: 'take tea/coffee break', defaultStartHour: 11, defaultDuration: 15, icon: 'coffee' },
			{ _id: '12', value: 'others', displayName: 'Others', selectedDisplayText: 'need personal time', defaultStartHour: 16, defaultDuration: 30, icon: 'account' }
		];
		if (excludeOptions) {
			let excludeIds = excludeOptions.map(x => { return x._id });
			a = a.filter(x => { return excludeIds.indexOf(x._id) >= 0 ? false : true; });
		}
		return a;
	}
	getActivityTimeOptions(clockType: string = '12h'): I_option[] {
		let a: I_option[] = [];
		for (let h = 0; h < 24; h++) {
			for (let m = 0; m < 60; m += 15) {
				a.push({
					_id: h + '_' + m,
					displayName: formatDisplayTime(h + (m / 60), clockType),
					value: (h + (m / 60))
				})
			}
		}
		return a;
	}
	getTimeOptionFromStartHour(hour: number, clockType: string = '12h'): I_option {
		let h = Math.floor(hour), m = Math.round((hour - h) * 60);
		return {
			_id: h + '_' + m,
			displayName: formatDisplayTime(h + (m / 60), clockType),
		}
	}
	getDurationOptionFromMinutes(minutes: number): I_option {
		return {
			_id: minutes + '',
			displayName: minutes + ' minute' + (minutes > 1 ? 's' : ''),
			value: minutes
		}
	}

	getActivityDurationOptions(): I_option[] {
		let a: I_option[] = [
			{ _id: '5', displayName: "5 minutes", value: 5 },
			{ _id: '10', displayName: "10 minutes", value: 10 },
			{ _id: '15', displayName: "15 minutes", value: 15 },
			{ _id: '20', displayName: "20 minutes", value: 20 },
			{ _id: '30', displayName: "30 minutes", value: 30 },
			{ _id: '45', displayName: "45 minutes", value: 45 },
			{ _id: '60', displayName: "1 hour", value: 60 },
			{ _id: '120', displayName: "2 hours", value: 120 },
			{ _id: '180', displayName: "3 hours", value: 180 },
			{ _id: '240', displayName: "4 hours", value: 240 },
			{ _id: '300', displayName: "5 hours", value: 300 },
			{ _id: '360', displayName: "6 hours", value: 360 },
			{ _id: '420', displayName: "7 hours", value: 420 },
			{ _id: '480', displayName: "8 hours", value: 480 }
		];
		return a;
	}

	getColorOptions(): I_option[] {
		return [
			{ _id: 'yellow', displayName: 'Yellow', value: '#FFDC8F' },
			{ _id: 'blue', displayName: 'Blue', value: '#8FC9FF' },
			{ _id: 'green', displayName: 'Green', value: '#94E5D5' },
			{ _id: 'orange', displayName: 'Orange', value: '#FA7963' },
		]
	}
	getDefaultcolorOption(): I_option { return { _id: 'blue', displayName: 'Blue', value: '#8FC9FF' }; }


}
