import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, I_option } from '@core/services/data.service';
import {
  I_meeting,
  I_timeslot,
  MeetingService,
} from '@core/services/meeting.service';
import { I_people } from '@core/services/people.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  LocalKey,
  LocalStorageService,
} from '@core/services/local-storage.service';
import { ApiResponse, ApiService } from '@core/services/api.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  tabItems: I_option[] = [
    { _id: 'main', displayName: 'Main info' },
    { _id: 'more', displayName: 'Additional info' },
    { _id: 'advanced', displayName: 'Advanced' },
  ];

  @Input() selectedTabId: string = 'main';
  @ViewChild('tabContentCon') tabContentCon!: ElementRef;

  creator!: I_people;
  user!: I_people;
  attendees: I_people[] = [];

  schedulingTypeOptions: I_option[] = [];
  availabilityOptions: I_option[] = [
    { _id: '1', displayName: 'Default availability' },
    { _id: '2', displayName: 'Customise for this meeting' },
  ];
  preferenceOptions: I_option[] = [
    { _id: '1', displayName: 'Default preference' },
    { _id: '2', displayName: 'Customise for this meeting' },
  ];
  durationOptions: I_option[] = [];
  channelOptions: I_option[] = [];
  withinDateOptions: I_option[] = [];
  scheduleAfterOptions: I_option[] = [];
  movableOptions: I_option[] = [];
  meetingAccessOptions: I_option[] = [];
  bufferTimeAfterOptions: I_option[] = [];
  bufferTimeBeforeOptions: I_option[] = [];

  scheduleForm!: FormGroup;
  nameRecoOptions: I_option[] = [];

  defaultWithinDate: I_option;
  defaultScheduleAfter: I_option;
  defaultBufferTimeBefore: I_option;
  defaultBufferTimeAfter: I_option;

  isLoadingBestTime: boolean = false;
  constructor(
    private meetingService: MeetingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dataService: DataService,
    private apiService: ApiService,
    private dialogService: DialogService
  ) {
    this.schedulingTypeOptions = this.meetingService.getSchedulingTypeOptions();
    this.durationOptions = this.meetingService.getDurationOptions();
    this.channelOptions = this.meetingService.getChannelOptions();
    this.withinDateOptions = this.meetingService.getWithinDateOptions();
    this.scheduleAfterOptions = this.meetingService.getScheduleAfterOptions();
    this.movableOptions = this.meetingService.getMovableOptions();
    this.meetingAccessOptions = this.meetingService.getMeetingAccessOptions();
    this.bufferTimeBeforeOptions = this.meetingService.getBufferOptions();
    this.bufferTimeAfterOptions = this.meetingService.getBufferOptions();

    this.user = this.localStorageService.getLocal(LocalKey.user);
    this.creator = { ...this.user, isYou: true };

    this.defaultWithinDate = this.meetingService.getDefaultWithinDateOption();
    this.defaultScheduleAfter =
      this.meetingService.getDefaultScheduleAfterOption();
    this.defaultBufferTimeBefore =
      this.meetingService.getDefaultBufferTimeBeforeOption();
    this.defaultBufferTimeAfter =
      this.meetingService.getDefaultBufferTimeAfterOption();

    this.scheduleForm = this.fb.group({
      //Main
      name: [null, [Validators.required]],
      meetingType: [null],
      duration: [this.durationOptions[0], [Validators.required]],
      channel: [null, [Validators.required]],
      attendees: [[this.creator], [Validators.required]],
      creator: [this.creator, [Validators.required]],
      timeslots: [[]],
      hostTimeslots: [[]],

      //More
      description: [''],
      color: [this.dataService.getDefaultcolorOption(), [Validators.required]],

      //Advanced
      activeListening: [true, [Validators.required]],
      withinDate: [this.defaultWithinDate, [Validators.required]],
      scheduleAfter: [this.defaultScheduleAfter, [Validators.required]],
      bufferTimeBefore: [this.defaultBufferTimeBefore, [Validators.required]],
      bufferTimeAfter: [this.defaultBufferTimeAfter, [Validators.required]],

      //Generated
      meeting: [null],
    });
    this.updateTitleRecos();
  }
  get gf() {
    return this.scheduleForm.controls;
  }

  ngOnInit(): void {
    this.decodeURL().then((r) => {
      console.log('resolve r= ', r);
      this.scheduleForm.patchValue(r);
      this.updateTitleRecos();
      this.updateBestTimes();
    });
  }
  decodeURL(): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const url = this.router.url;
      let paramStr = url.split('?')[1];
      const t = new URLSearchParams(paramStr);
      const name = t.has('name')
        ? { _id: '-1', displayName: t.get('name') }
        : this.gf.name.value;
      const duration = t.has('duration')
        ? this.durationOptions.find((x) => {
            return x.value == t.get('duration');
          })
        : this.gf.duration.value;
      const channel = t.has('channel')
        ? this.channelOptions.find((x) => {
            return x._id == t.get('channel');
          })
        : this.gf.channel.value;
      if (t.has('meetingTypeId')) {
        const meetingTypeId = t.get('meetingTypeId');
        this.apiService
          .apiCall('getMeetingType', { _id: meetingTypeId })
          .subscribe(
            (r) => {
              if (r.status == 'success') {
                const meetingType = r.meetingType;
                resolve({ name: meetingType, duration, channel, meetingType });
              } else resolve({ name, duration, channel });
            },
            (e) => {
              resolve({ name, duration, channel });
            }
          );
      } else {
        resolve({ name, duration, channel });
      }
    });
    return promise;
  }
  updateBestTimes() {
    this.isLoadingBestTime = true;
    this.meetingService
      .getBestTime(this.scheduleForm.value)
      .then((r) => {
        this.isLoadingBestTime = false;
        let timeslots = r.bestTimes || [];
        //timeslots = timeslots.slice(0, 5);
        this.scheduleForm.patchValue({ timeslots });
      })
      .catch((e) => {
        this.isLoadingBestTime = false;
      });
  }

  onTabClick(tabItem: I_option, tabIndex: number) {
    this.selectedTabId = tabItem._id;
    this.tabContentCon.nativeElement.style.transform =
      'translateX(' + -tabIndex * 33.3333 + '%)';
  }
  onBackClick(): void {
    this.router.navigate(['home']);
  }
  onSelect(e: any, fieldName: string) {
    console.log('onSelect', e, fieldName);
    if (fieldName == 'name') {
      console.log(e.value);
      this.scheduleForm.patchValue({ name: e.value });
      this.scheduleForm.patchValue({ meetingType: e.value });
    } else if (fieldName == 'duration') {
      this.scheduleForm.patchValue({ duration: e.value });
      this.updateBestTimes();
    } else if (fieldName == 'meetingType') {
    } else if (fieldName == 'channel') {
      this.scheduleForm.patchValue({ channel: e.value });
    } else if (fieldName == 'color') {
      this.scheduleForm.patchValue({ color: e.value });
    } else if (fieldName == 'withinDate') {
      this.scheduleForm.patchValue({ withinDate: e.value });
    } else if (fieldName == 'scheduleAfter') {
      this.scheduleForm.patchValue({ scheduleAfter: e.value });
    } else if (fieldName == 'bufferTimeBefore') {
      this.scheduleForm.patchValue({ bufferTimeBefore: e.value });
    } else if (fieldName == 'bufferTimeAfter') {
      this.scheduleForm.patchValue({ bufferTimeAfter: e.value });
    } else if (fieldName == 'timeslot') {
      let timeslots = this.gf.timeslots.value || [],
        hostTimeslots = [],
        changedTimeslot = e.data,
        selected = e.value;
      for (let i = 0, len = timeslots.length; i < len; i++) {
        let x = timeslots[i];
        if (x.id == changedTimeslot.id) {
          x.isSelected = selected;
        }
        if (x.isSelected) hostTimeslots.push(x);
      }
      this.scheduleForm.patchValue({ timeslots, hostTimeslots });
    }
    this.updateTitleRecos();
  }
  onClearTypeSelect(e: any) {
    this.scheduleForm.patchValue({ meetingType: null, name: null });
    this.updateTitleRecos();
  }
  updateTitleRecos(): void {
    let t = this.gf.duration.value;
    let durationDisplayName = t.shortName || t.displayName;
    let typeDisplayName = this.gf.meetingType.value?.displayName || 'meeting';
    typeDisplayName = typeDisplayName.toLowerCase();
    if (durationDisplayName && typeDisplayName) {
      let name = durationDisplayName + ' ' + typeDisplayName;
      if (name !== this.gf.name?.value) {
        this.nameRecoOptions = [{ _id: '-1', displayName: name }];
      }
    }
  }
  selectRecoTitle(item: I_option) {
    this.scheduleForm.patchValue({ name: item });
    this.nameRecoOptions = [];
  }

  onSelectPeople(e: any) {
    if (!e.value || !e.value.email) return;
    if (!this.checkAttendeeExists(e.value.email)) {
      this.attendees.push(e.value);
      this.gf.attendees.value.push(e.value);
    } else {
      this.snackBar.open('Email already added', 'Dismiss', { duration: 2000 });
    }
  }
  checkAttendeeExists(email: string): boolean {
    let t = this.attendees,
      alreadyAdded = false;
    for (let i = 0, len = t.length; i < len; i++) {
      if (t[i].email == email) {
        alreadyAdded = true;
        break;
      }
    }
    return alreadyAdded;
  }
  removeAttendee(email: string): boolean {
    let t = this.attendees,
      newAttendees = [],
      success = false,
      removeIndex = -1;
    for (let i = 0, len = t.length; i < len; i++) {
      if (t[i].email == email) {
        success = true;
      } else newAttendees.push(t[i]);
    }
    this.attendees = newAttendees;
    this.scheduleForm.patchValue({
      attendees: [this.creator].concat(newAttendees),
    });
    return success;
  }
  onPeopleMoreClick(e: any) {
    // console.log('onMoreItemSelect', e);
    if (e.value._id == 'delete') {
      this.removeAttendee(e.data.email);
    }
  }
  showMeetingCreated(link: string) {
    const openMeetingLink = () => {
      window.open(link, '_blank');
    };
    this.dialogService.openDialog({
      title: 'Single meeting link generated',
      link: link,
      btns: [
        {
          btnTitle: 'Open the meeting',
          type: 'positive',
          callback: openMeetingLink,
        },
        { btnTitle: 'Cancel', type: 'neutral' },
      ],
    });
  }
  generateMeetingLink(silently: boolean = false): void {
    if (this.gf.meeting.value && this.gf.meeting.value.link) {
      this.showMeetingCreated(this.gf.meeting.value.link);
      return;
    }
    if (!silently)
      this.dialogService.showWait({ msg: 'Generating meeting link...' });
    this.meetingService
      .createMeeting(this.scheduleForm.value)
      .then((meeting: I_meeting) => {
        if (!silently) this.dialogService.closeWait();
        this.scheduleForm.patchValue({ meeting });
        if (meeting.link) this.showMeetingCreated(meeting.link);
      })
      .catch((e) => {
        if (!silently) this.dialogService.closeWait();
        this.dialogService.openDialog({
          title: 'Oops!',
          msg: 'Meeting link generation failed!',
        });
      });
  }
  showMeetingScheduled(link: string) {
    const goBackHome = () => {
        this.localStorageService.clearLocal(LocalKey.scheduleFormValue);
        this.router.navigate(['/home']);
      },
      openMeetingLink = () => {
        window.open(link, '_blank');
      };

    this.dialogService.openDialog({
      title: 'Meeting scheduled',
      link: link,
      btns: [
        {
          btnTitle: 'Back to my slate',
          type: 'positive',
          callback: goBackHome,
        },
        {
          btnTitle: 'Open the meeting',
          type: 'neutral',
          callback: openMeetingLink,
        },
      ],
    });
  }
  startScheduleNow(silently = false): void {
    if (this.gf.meeting.value && this.gf.meeting.value.startDateTime) {
      this.showMeetingScheduled(this.gf.meeting.value.link);
      return;
    }
    if (!silently) this.dialogService.showWait({ msg: 'Scheduling...' });
    this.meetingService
      .scheduleMeeting(this.scheduleForm.value)
      .then((meeting: I_meeting) => {
        if (!silently) this.dialogService.closeWait();
        this.scheduleForm.patchValue({ meeting });
        if (meeting.link) this.showMeetingScheduled(meeting.link);
      })
      .catch((e) => {
        if (!silently) this.dialogService.closeWait();
        this.dialogService.openDialog({
          title: 'Oops!',
          msg: 'Meeting link generation failed!',
        });
      });
  }
  startInviteEmail(): void {
    console.log(this.scheduleForm.value);
    this.dialogService.showWait({ msg: 'Generating meeting link...' });
    this.meetingService
      .createMeeting(this.scheduleForm.value)
      .then((meeting: I_meeting) => {
        this.dialogService.closeWait();
        this.scheduleForm.patchValue({ meeting });
        if (meeting.link) {
          // this.showMeetingCreated(meeting.link);
          this.localStorageService.storeLocal(
            LocalKey.scheduleFormValue,
            this.scheduleForm.value
          );
          this.router.navigate(['home/preview']);
        }
      })
      .catch((e) => {
        this.dialogService.closeWait();
        this.dialogService.openDialog({
          title: 'Oops!',
          msg: 'Meeting link generation failed!',
        });
      });
  }
}
