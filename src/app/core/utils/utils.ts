import { I_meeting } from "@core/services/meeting.service";

export function strtags(s: string) { return s.replace(/<\/?[^>]+>/gi, ''); }
export function formatDisplayTime(t: number | Date, clockType: string = '12h'): string {
    let hour = 0;
    if (typeof t == 'number') {
        hour = t;
    } else if (typeof t == 'object' && t.constructor.name == 'Date') {
        hour = t.getHours() + (t.getMinutes() / 60);
    }
    let h = Math.floor(hour), m = Math.round((hour - h) * 60);
    let s = '', suffix = '';
    if (clockType == '12h') {
        if (h > 12) {
            h = h - 12;
            suffix = 'pm';
        } else suffix = 'am';
    }
    s = h + ':' + (m < 10 ? '0' : '') + m + '' + (clockType == '12h' ? ' ' + suffix : '');
    return s;
}
export function formatDay(date: Date): string {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const dtf1 = new Intl.DateTimeFormat(locale, { weekday: "short" });
    let day = dtf1.format(date);
    if (isToday(date)) day = 'Today';
    else if (isTomorrow(date)) day = 'Tomorrow';
    return day;
}
export function formatDisplayDate(date: Date, type = "dMY", weekday = "short"): string {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;
    let currentDate = new Date();
    if (type == "dM") {
        const dateTimeFormat = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
        return dateTimeFormat.format(date);
    } else if (type == "day, date fullMonth") {
        const dtf1 = new Intl.DateTimeFormat(locale, { weekday: "short" });
        let day = dtf1.format(date);
        if (isToday(date)) day = 'Today';
        else if (isTomorrow(date)) day = 'Tomorrow';
        const dtf2 = new Intl.DateTimeFormat(locale, { month: "long", day: "numeric" });
        return day + ', ' + dtf2.format(date);
    } else if (type == "shortMonth date, 'shortYear") {
        const dtf1 = new Intl.DateTimeFormat(locale, { month: "short" });
        const dtf2 = new Intl.DateTimeFormat(locale, { year: "numeric" });
        return dtf1.format(date) + " " + date.getDate() + " '" + dtf2.format(date).slice(-2);
    } else {
        if (weekday == 'long') {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "short", day: "numeric" });
            return dateTimeFormat.format(date);
        } else if (weekday == 'short') {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
            return dateTimeFormat.format(date);
        } else {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });
            return dateTimeFormat.format(date);
        }
    }
}
export function isToday(date: Date) {
    let currentDate = new Date();
    let d1 = [date.getDate(), date.getMonth(), date.getFullYear()].join('/');
    let d2 = [currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear()].join('/');
    return (d1 == d2) ? true : false;
}
export function isTomorrow(date: Date) {
    let currentDate = new Date(), tomDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    let d1 = [date.getDate(), date.getMonth(), date.getFullYear()].join('/');
    let d2 = [tomDate.getDate(), tomDate.getMonth(), tomDate.getFullYear()].join('/');
    return (d1 == d2) ? true : false;
}

export function getDurationDisplayText(meeting: I_meeting): string {
    let edt = new Date(meeting.endDateTime).getTime(), sdt = new Date(meeting.startDateTime).getTime();
    let durationInHours = (edt - sdt) / (60 * 60 * 1000);
    return (((edt < sdt) ? "-" : "") + formatDuration(durationInHours));
}
export function formatDuration(durationInHours: number, type = "short"): string {
    let s = '';
    if (durationInHours > 0) {
        let h = Math.floor(durationInHours), m = durationInHours - h;
        let roundedM = Math.round(m * 60);
        if (type == 'long') {
            s = (h > 0 ? h + 'hour' + (h > 1 ? 's' : '') : '') + (m > 0 ? roundedM + ' minute' + (roundedM > 1 ? 's' : '') : '');
        } else if (type == 'medium') {
            s = (h > 0 ? h + 'hr' + (h > 1 ? 's' : '') : '') + (m > 0 ? roundedM + ' min' + (roundedM > 1 ? 's' : '') : '');
        } else {
            s = (h > 0 ? h + 'h ' : '') + (m > 0 ? roundedM + 'm' : '');
        }
    } else s = '';
    return s;
}



