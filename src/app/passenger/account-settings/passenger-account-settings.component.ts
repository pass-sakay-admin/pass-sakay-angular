import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-passenger-account-settings',
  templateUrl: './passenger-account-settings.component.html',
  styleUrls: ['./passenger-account-settings.component.scss']
})
export class PassengerAccountSettingsComponent implements OnInit {
  public breakpoint: number = 0;
  public active = 'usernameTabControl';

  public changeUsernameFormGroup!: FormGroup;
  public changeEmailFormGroup!: FormGroup;
  public changePasswordFormGroup!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initializeChangeUsernameFormGroup();
    this.initializeEmailFormGroup();
    this.initializePasswordFormGroup();
  }

  initializeChangeUsernameFormGroup = (): void => {
    this.changeUsernameFormGroup = new FormGroup({
      currentUsername: new FormControl('', Validators.required),
      newUsername: new FormControl('', Validators.required),
      confirmNewUsername: new FormControl('', Validators.required),
    })
  }

  initializeEmailFormGroup = (): void => {
    this.changeEmailFormGroup = new FormGroup({
      currentEmail: new FormControl('', Validators.required),
      newEmail: new FormControl('', Validators.required),
      confirmNewEmail: new FormControl('', Validators.required),
    })
  }

  initializePasswordFormGroup = (): void => {
    this.changePasswordFormGroup = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required),
    })
  }

  onSubmitChangeUsername = () => {
    console.log('changed username')
  }

  onSubmitChangeEmail = () => {
    console.log('changed email')
  }

  onSubmitChangePassword = () => {
    console.log('changed password')
  }
}