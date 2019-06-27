import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { User } from '../../shared/user';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: User;
  errMsg = '';

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    public userService: UserService,
    public formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: false
    });
  }

  closeDialog(success: boolean) {
    this.dialogRef.close(success);
  }

  ngOnInit() {
  }

  onSubmit() {
    this.user = this.loginForm.value;
    this.userService.login(this.user)
      .subscribe(
        status => {
          if (status.success) {
            this.dialogRef.close(true);
          } else {
            this.errMsg = status.err;
          }
        },
        err => {
          this.errMsg = err;
      });
  }

}
