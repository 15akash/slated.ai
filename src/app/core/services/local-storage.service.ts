import { Injectable } from '@angular/core';

export enum LocalKey {
  token = 'token',
  user = 'user',
  googleAPITokens = 'googleAPITokens',
  tempData = 'tempData',
  timeZones = 'timeZones',
  defaultTimeZone = 'defaultTimeZone',
  scheduleFormValue = 'scheduleFormValue'
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  tempData: any;

  constructor() { }
  storeLocal(key: LocalKey, value: string | Object) {
    let v = (typeof value !== 'string') ? JSON.stringify(value) : value;
    localStorage.setItem(key, v);
  }
  clearLocal(key: LocalKey) { localStorage.removeItem(key); }
  getLocal(key: LocalKey): any {
    let value = localStorage.getItem(key) || '', v = '';
    try { v = JSON.parse(value); }
    catch (error) { v = value; }
    return v;
  }

  storeTemp(data: any) { this.tempData = data; }
  getTemp() { return this.tempData; }
}
