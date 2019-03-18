import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NewsApp';

  constructor(iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('left-nav-arrow', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/left-nav-arrow.svg'));
    iconRegistry.addSvgIcon('right-nav-arrow', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/right-nav-arrow.svg'));
    iconRegistry.addSvgIcon('alert-base', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/alert-base.svg'));
    iconRegistry.addSvgIcon('alert-disabled', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/alert-disabled.svg'));
    iconRegistry.addSvgIcon('alert-on', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/alert-on.svg'));
    iconRegistry.addSvgIcon('category', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/category.svg'));
    iconRegistry.addSvgIcon('home', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/home.svg'));
    iconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/person.svg'));
    iconRegistry.addSvgIcon('person-add', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/person-add.svg'));
    iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/settings.svg'));
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/menu.svg'));
    iconRegistry.addSvgIcon('cancel', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/cancel.svg'));
  }
}
