import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger, MatDialog } from '@angular/material';

import { categories } from '../../shared/categories';

import { UserService } from '../../services/user.service';

import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = false;
  loggedIn: boolean = false;
  myCategories: string[] = categories;
  @ViewChild('categoryMenuTrigger') categoryMenuTrigger: MatMenuTrigger;
  @ViewChild('alertMenuTrigger') alertMenuTrigger: MatMenuTrigger;

  constructor(public userService: UserService,
    public router: Router,
    public dialog: MatDialog) { }

  // Close nested header menus when on mouse leave - desktop only
  closeNestedMenu(menu: string):void {
    if (!this.isMobile) {
      switch (menu) {
        case 'categories':
          this.categoryMenuTrigger.closeMenu();
          break;
        case 'alerts':
          this.alertMenuTrigger.closeMenu();
          break;
        default:
          break;
      }
    }
  }

  logout() {
    this.userService.logout();
  }

  // Navigate to articles by category page with chosen category
  navigateToCategory(category: string) {
    this.router.navigate(['/category'], {queryParams: {category: category}});
  }

  ngOnInit() {
    this.setIsMobile();
    this.loggedIn = this.userService.isLoggedIn();
    this.userService.refreshLogin.subscribe(status => {
      this.loggedIn = status;
    });
  }

  // Check if screen is mobile sized on window resize event
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setIsMobile();
  }

  // Open login modal
  openLogin() {
    const loginRef = this.dialog.open(
      LoginComponent,
      {
        width: '400px',
        height: '350px',
        panelClass: 'dialog-container'
      }
    );
    loginRef.afterClosed()
      .subscribe(status => {
        this.userService.refreshOnLoginLogout();
        this.loggedIn = status;
      });
  }

  // Open signup modal
  openSignup() {
    const signupRef = this.dialog.open(
      SignupComponent,
      {
        width: '400px',
        height: '600px',
        panelClass: 'dialog-container'
      }
    );
    signupRef.afterClosed()
      .subscribe(status => {
        if (status) {
          this.loggedIn = status;
          this.userService.refreshOnLoginLogout();
          this.router.navigate(['/profile']);
        }
      });
  }

  // Assign isMobile as having a screen width < 599px
  setIsMobile() {
    this.isMobile = window.innerWidth < 599;
  }

}
