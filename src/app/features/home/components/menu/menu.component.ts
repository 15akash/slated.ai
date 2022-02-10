import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { I_option } from '@core/services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  list1: I_option[] = [
    { _id: 'home', displayName: 'Home' },
    // { _id: 'calendar', displayName: 'Scheduler' },
    // { _id: 'edit', displayName: 'Notes' },
  ];
  list2: I_option[] = [
    // { _id: 'people', displayName: 'People' },
    { _id: 'account', displayName: 'Account' },
    // { _id: 'settings', displayName: 'Settings' },
    // { _id: 'call', displayName: 'Support' },
  ];
  list3: I_option[] = [
    // { _id: 'people', displayName: 'People' },
    { _id: 'people', displayName: 'People' },
    // { _id: 'settings', displayName: 'Settings' },
    // { _id: 'call', displayName: 'Support' },
  ];

  @Input() selectedPage: string = 'home';
  @Input() isExpanded: boolean = true;
  @Input() afterExpanded: boolean = true;
  @Input() afterCollapsed: boolean = false;

  constructor(private router: Router) {}
  ngOnInit(): void {}
  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
    this.afterExpanded = false;
    this.afterCollapsed = false;
    setTimeout(() => {
      if (this.isExpanded) this.afterExpanded = true;
      else this.afterCollapsed = true;
    }, 300);
  }
  onMenuItemClick(item: I_option) {
    console.log('on menu click:', item);
    switch (item._id) {
      case 'people':
        this.router.navigate(['home/people']);
        break;
      case 'account':
        this.router.navigate(['home/account']);
        break;
      default:
        this.router.navigate(['home']);
        break;
    }
  }
}
