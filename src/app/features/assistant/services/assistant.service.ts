import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '@core/services/api.service';
import { Observable } from 'rxjs';

export interface I_listItem {
  icon: string;
  displayName: string;
}
export interface I_btnItem {
  _id: string;
  displayText: string;
  color?: string;
}
export interface I_suggestionAction {
  api?: string;
  path?: string;
}
export interface I_suggestionItem {
  _id?: string;
  title: string;
  displayHTML: string;
  btns?: I_btnItem[];

  type: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  status: string;
  afterDate?: string;
  expiryDate?: string;
  onYes?: I_suggestionAction;
  onNo?: I_suggestionAction;
}

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  constructor(private apiService: ApiService) {}

  getMoreList(view: string): I_listItem[] {
    let list = [
      { icon: 'clock', displayName: 'Time freer' },
      { icon: 'defragment', displayName: 'Defragmenter' },
      { icon: 'focus-time', displayName: 'Focus time setter' },
      { icon: 'auto-manager', displayName: 'Auto-manager' },
      { icon: 'thumbs-up', displayName: 'Meeting recommender' },
      { icon: 'mic', displayName: 'Speech assistant' },
      { icon: 'train', displayName: 'Train your assistant' },
    ];
    if (view == 'meeting') {
    }
    return list;
  }

  getIntroSuggestions(): Observable<ApiResponse> {
    return this.apiService.apiCall('getNotification', {
      status: 'active',
      type: 'intro',
    });
  }

  /*Example usage: this.assistantService.insertNotification({
		title: 'Welcome', displayHTML: "Watch this space for suggestions", type: "intro", status: "active",
		btns: [{ _id: 'dismiss', displayText: "Dismiss", color: 'yellow' }, { _id: 'remindLater', displayText: "Remind later", color: "white" }]
	});*/
  insertNotification(data: I_suggestionItem): void {
    this.apiService
      .apiCall('saveNotification', { notificationData: data })
      .subscribe(
        (r) => {
          if (r.status == 'success') {
          } else console.log('insert notificaiton failed with response:', r);
        },
        (e) => {
          console.log('insert notification failed with error:', e);
        }
      );
  }

  //Example usage: this.assistantService.deleteNotification({ type: "intro", statusFields: ["active"] });
  deleteNotification(data: any): void {
    const { _id, statusFields, type } = data;
    this.apiService
      .apiCall('deleteNotification', { _id, statusFields, type })
      .subscribe(
        (r) => {
          if (r.status == 'success') {
          } else console.log('insert notificaiton failed with response:', r);
        },
        (e) => {
          console.log('insert notification failed with error:', e);
        }
      );
  }
  dismissNotification(data: I_suggestionItem): Promise<any> {
    data.status = 'dismissed';
    const promise = new Promise((resolve, reject) => {
      this.apiService
        .apiCall('saveNotification', { notificationData: data })
        .subscribe(
          (r) => {
            if (r.status == 'success') {
              resolve(r);
            } else reject(r);
          },
          (e) => {
            reject(e);
          }
        );
    });
    return promise;
  }
  remindLaterNotification(data: I_suggestionItem): Promise<any> {
    data.status = 'upcoming';
    data.afterDate = new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const promise = new Promise((resolve, reject) => {
      this.apiService
        .apiCall('saveNotification', { notificationData: data })
        .subscribe(
          (r) => {
            if (r.status == 'success') {
              resolve(r);
            } else reject(r);
          },
          (e) => {
            reject(e);
          }
        );
    });
    return promise;
  }

  getTitle(view: string): string {
    let title = 'SlatedAI assistant';
    if (view == 'person') title = 'Person';
    return title;
  }

  getPeoplePageOptions(view: string): I_listItem[] {
    let list = [
      { icon: 'edit2', displayName: 'Edit' },
      { icon: 'delete', displayName: 'Delete' },
    ];
    if (view == 'meeting') {
    }
    return list;
  }
}
