import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { User } from '../../shared/user';
import { PasswordPattern, PasswordMatch } from '../../validators/signup';
import { Countries } from '../../shared/countries';
import { Languages } from '../../shared/languages';
import { Source } from '../../shared/source';

import { UserService } from '../../services/user.service';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  user: User;
  controls;
  sources: Source[] = [];
  countries = Countries;
  languages = Languages;
  errMsg = '';
  toggleColor = 'accent';

  constructor(public userService: UserService,
    public newsService: NewsService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SignupComponent>) {
      this.signupForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.minLength(6), Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(8), PasswordPattern()]],
        passwordConfirmation: ['', [Validators.required]],
        firstname: ['', [Validators.maxLength(25)]],
        lastname: ['', [Validators.maxLength(25)]],
        country: ['us'],
        language: ['en'],
        preferredSources: [''],
      }, {
        validator: PasswordMatch()
      });
      this.controls = this.signupForm.controls;
    }

  closeDialog(success: boolean): void {
    this.dialogRef.close(success);
  }

  ngOnInit() {
    this.newsService.getSources()
      .subscribe(
        response => {
          this.sources = response.sources;
        },
        err => {
          this.errMsg = err;
      });
  }

  onSubmit(): void {
    this.user = this.signupForm.value;
    if (!this.user.username) {
      this.user.username = this.user.email;
    }
    console.log(this.user);
    this.userService.signup(this.user)
      .subscribe(
        status => {
          if (status.success) {
            return this.userService.login({
              username: this.user.username,
              password: this.user.password,
              remember: true
            }).subscribe(loginStatus => {
              if (loginStatus.success) {
                this.dialogRef.close(true);
              }
            });
          } else {
            this.errMsg = status.err;
          }
        },
        err => {
          this.errMsg = err;
      });
  }

}
