import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger, MatDialog } from '@angular/material';

// Constants
import { categories } from '../../shared/categories';

// Services
import { UserService } from '../../services/user.service';

// Components
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private isMobile: boolean = false;
  loggedIn: boolean = false;
  myCategories: string[] = categories;
  @ViewChild('categoryMenuTrigger') categoryMenuTrigger: MatMenuTrigger;
  @ViewChild('alertMenuTrigger') alertMenuTrigger: MatMenuTrigger;

  constructor(private userService: UserService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.setIsMobile();
    this.loggedIn = this.userService.isLoggedIn();
    this.userService.refreshLogin.subscribe(status => {
      this.loggedIn = status;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setIsMobile();
  }

  setIsMobile() {
    this.isMobile = window.innerWidth < 599;
  }

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

  logout() {
    this.userService.logout();
  }

  closeNestedMenu(menu: string) {
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

  navigateToCategory(category: string) {
    this.router.navigate(['/category'], {queryParams: {category: category}});
  }

}
