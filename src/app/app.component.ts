import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { fader, slider } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slider],
})
export class AppComponent {
  title = 'slated-mvp-webapp';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'email',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/email.svg')
    );
    iconRegistry.addSvgIcon(
      'email2',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/email2.svg')
    );
    iconRegistry.addSvgIcon(
      'hide-password',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/hide-password.svg')
    );
    iconRegistry.addSvgIcon(
      'show-password',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show-password.svg')
    );
    iconRegistry.addSvgIcon(
      'account',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/account.svg')
    );
    iconRegistry.addSvgIcon(
      'lock',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/lock.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg')
    );
    iconRegistry.addSvgIcon(
      'search-gray',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search-gray.svg')
    );
    iconRegistry.addSvgIcon(
      'search-blue',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search-blue.svg')
    );
    iconRegistry.addSvgIcon(
      'down-arrow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/down-arrow.svg')
    );

    iconRegistry.addSvgIcon(
      'notes',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/notes.svg')
    );
    iconRegistry.addSvgIcon(
      'mic',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/mic.svg')
    );
    iconRegistry.addSvgIcon(
      'video_s',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/video_s.svg')
    );
    iconRegistry.addSvgIcon(
      'video',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/video.svg')
    );
    iconRegistry.addSvgIcon(
      'location',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/location.svg')
    );

    //activity icons
    iconRegistry.addSvgIcon(
      'sleep',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/sleep.svg')
    );
    iconRegistry.addSvgIcon(
      'commute-to-work',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/commute-to-work.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'commute-to-home',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/commute-to-home.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'breakfast',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/breakfast.svg')
    );
    iconRegistry.addSvgIcon(
      'lunch',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/lunch.svg')
    );
    iconRegistry.addSvgIcon(
      'dinner',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/dinner.svg')
    );
    iconRegistry.addSvgIcon(
      'work-out',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/work-out.svg')
    );
    iconRegistry.addSvgIcon(
      'pray',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pray.svg')
    );
    iconRegistry.addSvgIcon(
      'rest',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/rest.svg')
    );
    iconRegistry.addSvgIcon(
      'coffee',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/coffee.svg')
    );

    iconRegistry.addSvgIcon(
      'more-horizontal',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/more-horizontal.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'more',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more.svg')
    );

    iconRegistry.addSvgIcon(
      'timezone',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/timezone.svg')
    );
    iconRegistry.addSvgIcon(
      'down-arrow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/down-arrow.svg')
    );

    iconRegistry.addSvgIcon(
      'menu_gray',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu_gray.svg')
    );
    iconRegistry.addSvgIcon(
      'menu_blue',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu_blue.svg')
    );
    iconRegistry.addSvgIcon(
      'flash',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/flash.svg')
    );
    iconRegistry.addSvgIcon(
      'route',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/route.svg')
    );

    iconRegistry.addSvgIcon(
      'copy',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/copy.svg')
    );
    iconRegistry.addSvgIcon(
      'share',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/share.svg')
    );
    iconRegistry.addSvgIcon(
      'reschedule',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/reschedule.svg')
    );
    iconRegistry.addSvgIcon(
      'cancel',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cancel.svg')
    );
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg')
    );

    iconRegistry.addSvgIcon(
      'tick',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tick.svg')
    );
    iconRegistry.addSvgIcon(
      'tick-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tick-white.svg')
    );

    //social media
    iconRegistry.addSvgIcon(
      'linkedin',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
    );
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg')
    );
    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
    );
    iconRegistry.addSvgIcon(
      'instagram',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg')
    );
    iconRegistry.addSvgIcon(
      'twitter',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg')
    );

    iconRegistry.addSvgIcon(
      'link',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/link.svg')
    );

    iconRegistry.addSvgIcon(
      'zoom',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/zoom.svg')
    );
    iconRegistry.addSvgIcon(
      'google-chat',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google-chat.svg')
    );

    //Assistant icons:
    iconRegistry.addSvgIcon(
      'close-gray',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close-gray.svg')
    );
    iconRegistry.addSvgIcon(
      'clock',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clock.svg')
    );
    iconRegistry.addSvgIcon(
      'defragment',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defragment.svg')
    );
    iconRegistry.addSvgIcon(
      'focus-time',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/focus-time.svg')
    );
    iconRegistry.addSvgIcon(
      'auto-manager',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auto-manager.svg')
    );
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/thumbs-up.svg')
    );
    iconRegistry.addSvgIcon(
      'mic',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/mic.svg')
    );
    iconRegistry.addSvgIcon(
      'train',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/train.svg')
    );

    iconRegistry.addSvgIcon(
      'arrow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow.svg')
    );
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/home.svg')
    );
    iconRegistry.addSvgIcon(
      'edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg')
    );
    iconRegistry.addSvgIcon(
      'edit2',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit2.svg')
    );
    iconRegistry.addSvgIcon(
      'calendar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar.svg')
    );
    iconRegistry.addSvgIcon(
      'apps',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/apps.svg')
    );
    iconRegistry.addSvgIcon(
      'notifications',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/notifications.svg')
    );
    iconRegistry.addSvgIcon(
      'settings',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg')
    );
    iconRegistry.addSvgIcon(
      'people',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/people.svg')
    );
    iconRegistry.addSvgIcon(
      'call',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/call.svg')
    );
    iconRegistry.addSvgIcon(
      'messages',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/messages.svg')
    );

    iconRegistry.addSvgIcon(
      'star',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/star.svg')
    );
    iconRegistry.addSvgIcon(
      'half_star',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/half_star.svg')
    );
    iconRegistry.addSvgIcon(
      'zero_star',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/zero_star.svg')
    );

    iconRegistry.addSvgIcon(
      'briefcase',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/briefcase.svg')
    );
    iconRegistry.addSvgIcon(
      'link-2',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/link-2.svg')
    );
    iconRegistry.addSvgIcon(
      'ms-teams',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ms-teams.svg')
    );
    iconRegistry.addSvgIcon(
      'messages',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/messages.svg')
    );
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
