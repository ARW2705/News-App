import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../shared/user';
import { Countries } from '../../shared/countries';
import { Languages } from '../../shared/languages';
import { Source } from '../../shared/source';

import { UserService } from '../../services/user.service';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User;
  controls;
  sources: Source[] = [];
  countries = Countries;
  languages = Languages;
  errMsg: string;

  constructor(public formBuilder: FormBuilder,
    public userService: UserService,
    public newsService: NewsService) { }

  // Get user profile and map to profile form
  getProfile(): void {
    this.userService.getUserProfile()
      .subscribe(
        user => {
          this.user = user;
          this.profileForm = this.formBuilder.group({
            email: [user.email, [Validators.required, Validators.email]],
            username: [user.username, [Validators.minLength(6), Validators.maxLength(20)]],
            firstname: [user.firstname, [Validators.maxLength(25)]],
            lastname: [user.lastname, [Validators.maxLength(25)]],
            country: [user.country],
            language: [user.language],
            preferredSources: [user.preferredSources],
          });
          this.controls = this.profileForm.controls;
        },
        err => {
          this.errMsg = err;
        }
      );
    this.newsService.getSources()
      .subscribe(
        response => {
          this.sources = response.sources;
        },
        err => {
          this.errMsg = err;
      });
  }

  ngOnInit() {
    this.userService.refreshLogin.subscribe(status => {
      if (status) {
        this.getProfile();
      }
    });
    if (this.userService.isLoggedIn()) {
      this.getProfile();
    }
  }

  // Submit profile update
  onUpdate(): void {
    const update = this.profileForm.value;
    this.userService.updateUserProfile(update)
      .subscribe(
        status => {
          if (status.success) {
            // TODO show success notification
          }
        },
        err => {
          this.errMsg = err;
        }
      );
  }

  // Begin password reset process
  resetPassword(): void {
    this.userService.resetPassword()
      .subscribe(
        status => {
          if (status.statuCode == 200) {
            // show reset notification
          }
        },
        err => {
          this.errMsg = err;
        }
      );
  }

}
