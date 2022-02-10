import { Injectable } from '@angular/core';
import {
  formatDay,
  formatDisplayDate,
  formatDisplayTime,
} from '@core/utils/utils';
import { ApiResponse, ApiService } from './api.service';
import { I_option } from './data.service';
import { LocalKey, LocalStorageService } from './local-storage.service';
import { I_people } from './people.service';

export interface I_meeting {
  name: string;
  startDateTime: string;
  endDateTime: string;

  _id?: string;
  displayStartDate?: string;
  attendees?: I_people[];
  description?: string;
  duration?: I_option;
  location?: string;

  createdAt?: string;
  updatedAt?: string;
  userId?: string;

  googleData?: any;
  source?: string;
  status?: string;
  timeslots?: any;
  hostTimeslots?: any;

  creator?: I_people;
  link?: string;
  allowInviteeBestTime?: boolean;
}
export interface I_meetingGroup {
  groupName: string;
  meetings: I_meeting[];
}

export interface I_meetingResponse {
  status?: string;
  meetings: I_meeting[];
  skip?: number;
  limit?: number;
  totalItems?: number;
}

export interface I_meetingType {
  _id: string;
  displayName: string;
  name: string;

  typicalDuration?: any;
  typicalOccurrence?: any;
  nature?: string[];
  vertical?: string[];
  importance?: string[];
  stress?: any;
  attendeeRoles?: any;
  numAttendees?: any;

  googleLocationType1?: any;
  googleLocationType2?: any;

  preferredTimes?: any;
  avoidTimes?: any;
  preferredDays?: any;
  avoidDays?: any;
  preferredDates?: any;
  avoidDates?: any;
  preferredWeeks?: any;
  avoidWeeks?: any;
  preferredMonths?: any;
  avoidMonths?: any;
  ruleWt?: number;

  searchKeywords?: string;
  description?: string;
}
export interface I_meetingTypeResponse {
  status?: string;
  meetingTypes: I_meetingType[];
  skip?: number;
  limit?: number;
  totalItems?: number;
}
export interface I_timeslot {
  id: number;
  startDtStr: string;
  endDtStr: string;
  rankObj: any;
  rank: number;
  isSelected?: boolean;
}
export interface I_bestTimeResponse {
  status: string;
  bestTimes?: any;
  computeTimeInMs: number;
  totalTimeInMs: number;
  dbTimeInMs: number;
  maxRank: number;
  minRank: number;
}

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService
  ) {}

  getMeetingType(searchString: string = ''): Promise<I_meetingTypeResponse> {
    const promise: Promise<I_meetingTypeResponse> = new Promise(
      (resolve, reject) => {
        this.apiService
          .apiCall('getMeetingType', { searchString, limit: 20 })
          .subscribe(
            (res: I_meetingTypeResponse) => {
              if (res && res.status == 'success') {
                resolve(res);
              } else reject(false);
            },
            (err) => {
              reject(false);
            }
          );
      }
    );
    return promise;
  }
  getMeetings(): Promise<I_meetingGroup[]> {
    let user = this.localStorageService.getLocal(LocalKey.user);
    const promise: Promise<I_meetingGroup[]> = new Promise(
      (resolve, reject) => {
        this.apiService.apiCall('getMeetings', { userId: user._id }).subscribe(
          (res: I_meetingResponse) => {
            if (res && res.status == 'success') {
              let meetingsPerDay = this.groupMeetingsPerDay(res);
              resolve(meetingsPerDay);
            } else reject(false);
          },
          (err) => {
            reject(false);
          }
        );
      }
    );
    return promise;
  }
  groupMeetingsPerDay(res: I_meetingResponse): I_meetingGroup[] {
    let meetings = res.meetings,
      hash: any = {},
      groups: I_meetingGroup[] = [];
    let count = -1;
    for (let i = 0, len = meetings.length; i < len; i++) {
      let day = formatDisplayDate(
        new Date(meetings[i].startDateTime),
        'day, date fullMonth'
      );
      if (!hash[day]) {
        hash[day] = [meetings[i]];
        count++;
        groups[count] = { groupName: day, meetings: [meetings[i]] };
      } else {
        hash[day].push(meetings[i]);
        groups[count].meetings.push(meetings[i]);
      }
    }
    return groups;
  }
  getDefaultMeetingType(): I_meetingType {
    return { _id: '0', name: 'default', displayName: 'Default meeting' };
  }
  getCustomMeetingType(displayName: string = 'Custom'): I_meetingType {
    return { _id: '-1', name: 'custom', displayName };
  }
  getBestTime(data: any): Promise<I_bestTimeResponse> {
    let apiData = { ...data };
    let user = this.localStorageService.getLocal(LocalKey.user);
    if (!apiData.timeZone)
      apiData.timeZone = this.localStorageService.getLocal(
        LocalKey.defaultTimeZone
      );
    if (!apiData.title) apiData.title = apiData.name || 'Meeting';

    if (!apiData.duration) apiData.duration = 30;
    else apiData.duration = apiData.duration.value;

    if (!apiData.meetingType)
      apiData.meetingType = this.getDefaultMeetingType();
    else if (apiData.meetingType) {
      let mt = apiData.meetingType,
        _id = mt._id + '';
      if (_id == '-1')
        apiData.meetingType = this.getCustomMeetingType(apiData.title);
    }

    if (apiData.bufferTimeAfter)
      apiData.bufferTimeAfter = apiData.bufferTimeAfter.value;
    if (apiData.bufferTimeBefore)
      apiData.bufferTimeBefore = apiData.bufferTimeBefore.value;

    apiData.minuteStep = 15;
    apiData.meetingPreference = {
      preferredTimes: [
        { fromHour: 8, tillHour: 12 },
        { fromHour: 14, tillHour: 22 },
      ],
    };

    const promise: Promise<I_bestTimeResponse> = new Promise(
      (resolve, reject) => {
        this.apiService
          .apiCall('getBestTime', { userId: user._id, ...apiData })
          .subscribe(
            (res: I_bestTimeResponse) => {
              console.log('best time res=', res);
              if (res && res.status == 'success') {
                resolve(res);
              } else reject(false);
            },
            (err) => {
              reject(false);
            }
          );
      }
    );
    return promise;
  }

  getTimeslotDisplayStr(d: Date): string {
    return (
      formatDisplayTime(d) +
      ' ' +
      formatDay(d) +
      ', ' +
      formatDisplayDate(d, "shortMonth date, 'shortYear")
    );
  }
  amIHost(email: string, meetingData: I_meeting): boolean {
    let creator = meetingData.creator;
    if (!creator) return false;
    if (creator.email && creator.email == email) return true;
    else {
      let attendees = meetingData.attendees || [],
        isHost = false;
      for (let i = 0; i < attendees.length; i++) {
        let a = attendees[i];
        if (a.email == email && a.permission == 'host') {
          isHost = true;
          break;
        }
      }
      return isHost;
    }
  }
  amIInvited(email: string, meetingData: I_meeting): boolean {
    let creator = meetingData.creator;
    if (!creator) return false;
    if (creator.email && creator.email == email) return true;
    else {
      let attendees = meetingData.attendees || [],
        isInvited = false;
      for (let i = 0; i < attendees.length; i++) {
        let a = attendees[i];
        if (a.email == email) {
          isInvited = true;
          break;
        }
      }
      return isInvited;
    }
  }

  sendMeetingEmail(data: any): Promise<ApiResponse> {
    const promise = new Promise<ApiResponse>((resolve, reject) => {
      this.apiService.apiCall('sendMeetingEmail', { ...data }).subscribe(
        (r) => {
          if (r.status == 'success') resolve(r);
          else reject(r);
        },
        (e) => {
          reject(e);
        }
      );
    });
    return promise;
  }
  cancelMeeting(data: any): Promise<ApiResponse> {
    const promise = new Promise<ApiResponse>((resolve, reject) => {
      const status = 'cancelled';
      this.apiService.apiCall('cancelMeeting', { ...data, status }).subscribe(
        (r: ApiResponse) => {
          resolve(r);
        },
        (e) => {
          reject(e);
        }
      );
    });
    return promise;
  }
  confirmMeetingTime(
    email: string,
    selectedTimeslot: I_timeslot,
    selectionType: string,
    meetingData: I_meeting
  ): Promise<ApiResponse> {
    const promise = new Promise<ApiResponse>((resolve, reject) => {
      this.apiService
        .apiCall('confirmMeetingTime', {
          meetingData,
          email,
          selectedTimeslot,
          selectionType,
        })
        .subscribe(
          (r: ApiResponse) => {
            resolve(r);
          },
          (e) => {
            reject(e);
          }
        );
    });
    return promise;
  }
  createMeeting(data: any): Promise<I_meeting> {
    const promise = new Promise<I_meeting>((resolve, reject) => {
      let user = this.localStorageService.getLocal(LocalKey.user);
      let defaultTimeZone = this.localStorageService.getLocal(
        LocalKey.defaultTimeZone
      );
      const userId = user._id;
      const status = data.status || 'pending';
      const source = data.source || 'schedule-from-home';
      const preferences = {
        clockType: 'h12',
        timeZoneName: defaultTimeZone.name,
      };
      const name = data.meetingType ? data.meetingType.displayName : 'Meeting';
      this.apiService
        .apiCall('createMeeting', {
          ...data,
          name,
          userId,
          status,
          source,
          preferences,
        })
        .subscribe(
          (r: ApiResponse) => {
            if (r.status == 'success') {
              let meeting: I_meeting = r.data.meeting;
              if (meeting._id)
                meeting.link = 'https://app.myslate.us/meeting/' + meeting._id;
              resolve(meeting);
            } else reject(r);
          },
          (e) => {
            reject(e);
          }
        );
    });
    return promise;
  }
  scheduleMeeting(data: any): Promise<I_meeting> {
    const promise = new Promise<I_meeting>((resolve, reject) => {
      let user = this.localStorageService.getLocal(LocalKey.user);
      let defaultTimeZone = this.localStorageService.getLocal(
        LocalKey.defaultTimeZone
      );
      const userId = user._id;
      const status = data.status || 'pending';
      const source = data.source || 'schedule-from-home';
      const preferences = {
        clockType: 'h12',
        timeZoneName: defaultTimeZone.name,
      };
      const name = data.name ? data.name.displayName : 'Meeting';

      this.apiService
        .apiCall('createMeeting', {
          ...data,
          name,
          userId,
          status,
          source,
          preferences,
          insertCalendar: 'google',
        })
        .subscribe(
          (r: ApiResponse) => {
            if (r.status == 'success') {
              let meeting: I_meeting = r.data.meeting;
              let insertResult = r.data.insertResult;
              if (meeting._id)
                meeting.link = 'https://app.myslate.us/meeting/' + meeting._id;
              resolve(meeting);
            } else reject(r);
          },
          (e) => {
            reject(e);
          }
        );
    });
    return promise;
  }
  getMeetingDetail(
    meetingId: string,
    statusFields = ['confirmed', 'pending', 'cancelled']
  ): Promise<I_meeting> {
    const promise = new Promise<I_meeting>((resolve, reject) => {
      this.apiService.apiCall('getMeetingDetail', { meetingId }).subscribe(
        (r: ApiResponse) => {
          if (r.status == 'success') {
            resolve(r.data);
          } else reject(r);
        },
        (e) => {
          reject(e);
        }
      );
    });
    return promise;
  }

  getSchedulingTypeOptions(): I_option[] {
    return [
      { _id: 'single-meeting', displayName: 'Single meeting' },
      { _id: 'multi-meeting', displayName: 'Multiple meetings' },
      { _id: 'round-robin', displayName: 'Round robin' },
      { _id: 'recurring', displayName: 'Recurring' },
    ];
  }
  getWithinDateOptions(): I_option[] {
    return [
      { _id: 'eod', displayName: 'by end of day' },
      { _id: 'tom', displayName: 'by tomorrow' },
      { _id: '2d', displayName: 'within 2 days' },
      { _id: '3d', displayName: 'within 3 days' },
      { _id: '5d', displayName: 'within 5 days' },
      { _id: 'eow', displayName: 'by end of week' },
      { _id: '7d', displayName: 'within 7 days' },
      { _id: '14d', displayName: 'within 2 weeks' },
      { _id: 'eom', displayName: 'by end of month' },
      { _id: '30d', displayName: 'within 30 days' },
      { _id: '60d', displayName: 'within 60 days' },
    ];
  }
  getDefaultWithinDateOption(): I_option {
    return { _id: '3d', displayName: 'within 3 days' };
  }
  getScheduleAfterOptions(): I_option[] {
    return [
      { _id: 'now', displayName: 'now' },
      { _id: '1h', displayName: '1 hour from now' },
      { _id: '2h', displayName: '2 hours from now' },
      { _id: '4h', displayName: '4 hours from now' },
      { _id: '1d', displayName: 'today' },
      { _id: '2d', displayName: 'tomorrow' },
      { _id: '3d', displayName: 'day after tomorrow' },
      { _id: 'eow', displayName: 'next week' },
      { _id: 'eom', displayName: 'next month' },
    ];
  }
  getDefaultScheduleAfterOption(): I_option {
    return { _id: 'now', displayName: 'now' };
  }
  getBufferOptions(): I_option[] {
    return [
      { _id: '5', displayName: '5 minutes', value: 5 },
      { _id: '10', displayName: '10 minutes', value: 10 },
      { _id: '15', displayName: '15 minutes', value: 15 },
      { _id: '20', displayName: '20 minutes', value: 20 },
      { _id: '30', displayName: '30 minutes', value: 30 },
      { _id: '45', displayName: '45 minutes', value: 45 },
      { _id: '60', displayName: '1 hour', value: 60 },
    ];
  }
  getDefaultBufferTimeAfterOption(): I_option {
    return { _id: '10', displayName: '10 minutes', value: 10 };
  }
  getDefaultBufferTimeBeforeOption(): I_option {
    return { _id: '10', displayName: '10 minutes', value: 10 };
  }
  getMovableOptions(): I_option[] {
    return [
      { _id: 'none', displayName: 'none' },
      { _id: '1d', displayName: 'a day' },
      { _id: '2d', displayName: '2 days' },
      { _id: '1w', displayName: 'week' },
      { _id: '2w', displayName: '2 weeks' },
      { _id: '1m', displayName: 'this month' },
      { _id: '2m', displayName: '2 months' },
    ];
  }
  getMeetingAccessOptions(): I_option[] {
    return [
      { _id: 'public', displayName: 'anyone with link' },
      { _id: 'private', displayName: 'only added emails' },
      { _id: 'secure', displayName: 'added emails with passcode' },
    ];
  }
  getDurationOptions(): I_option[] {
    return [
      { _id: '1', displayName: '15 minutes', value: 15, shortName: '15 min' },
      { _id: '2', displayName: '30 minutes', value: 30, shortName: '30 min' },
      { _id: '3', displayName: '45 minutes', value: 45, shortName: '45 min' },
      { _id: '4', displayName: '1 hour', value: 60, shortName: '1 hour' },
      {
        _id: '5',
        displayName: '1 hour 15 minutes',
        value: 75,
        shortName: '1h 15m',
      },
      {
        _id: '6',
        displayName: '1 hour 30 minutes',
        value: 90,
        shortName: '1.5 hour',
      },
      {
        _id: '7',
        displayName: '1 hour 45 minutes',
        value: 105,
        shortName: '1h 45m',
      },
      { _id: '8', displayName: '2 hours', value: 120, shortName: '2 hour' },
      { _id: '9', displayName: '2.5 hours', value: 150, shortName: '2.5 hour' },
      { _id: '10', displayName: '3 hours', value: 180, shortName: '3 hour' },
      { _id: '11', displayName: '4 hours', value: 240, shortName: '4 hour' },
      {
        _id: '12',
        displayName: 'Half day (5h)',
        value: 300,
        shortName: 'Half day',
      },
      {
        _id: '13',
        displayName: 'Whole day (8h)',
        value: 480,
        shortName: 'Full day',
      },
    ];
  }
  getChannelOptions(): I_option[] {
    return [
      { _id: 'in-person', displayName: 'In-person', icon: 'location' },
      { _id: 'phone', displayName: 'Phone call', icon: 'call' },
      { _id: 'zoom', displayName: 'Zoom', icon: 'zoom' },
      { _id: 'google-meet', displayName: 'Google meet', icon: 'google-chat' },
      { _id: 'ms-teams', displayName: 'Microsoft Teams', icon: 'ms-teams' },
      // { _id: 'slated', displayName: 'SlatedAI call', icon: 'video_s' },
      {
        _id: 'video',
        displayName: 'Video call (e.g., Facetime, Webex, Whatsapp, Skype)',
        icon: 'video',
      },
      {
        _id: 'invitees-decide',
        displayName: 'Let invitees decide',
        icon: 'messages',
      },
      // { _id: 'not-relevant', displayName: 'Not relevant', icon: 'clock' },
    ];
  }
}
