import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { cityList } from 'src/constants/ph-citymun-list';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService
  ) {}

  @ViewChild('screen') screen!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('downloadLink') downloadLink!: ElementRef;

  public category: string = '';
  public passengerStepControls: string = '';
  public busdriverStepControls: string = '';
  public qrPassengerData: any;
  public qrData: string = '';
  public passengerFormGroup: FormGroup = new FormGroup({});
  public busDriverFormGroup: FormGroup = new FormGroup({});
  public disableBasicInfoNext: Boolean = true;
  public disableContactInfoNext: Boolean = true;
  public disableAccountInfoNext: Boolean = true;
  public disableSuccessRegister: Boolean = true;
  public disableBusBasicInfoNext: Boolean = true;
  public disableBusOperatorInfoNext: Boolean = true;
  public disableBusOperatorScanOptNext: Boolean = true;
  public disableBusAccountInfoNext: Boolean = true;
  public busDriverSuccessRegister: Boolean = false;

  public sendBusOTPForm: boolean = false;
  public sendPassengerOTPForm: boolean = false;
  public OTPCode: string = "";
  public OTPEmail: string = "";
  public OTPName: string = "";
  public disableSubmitButton: boolean = false;

  private newBusDriver: any;
  public parsedCityList: any;

  ngOnInit(): void {
    this.initializePassengerFormGroup();
    this.initializeBusDriverFormGroup();
    this.initCityList();
  }

  initCityList(): void {
    const rawCityList = cityList.RECORDS.map((city) => {
      if (city.provCode === '0133') {
        return city;
      }
      return;
    });
    this.parsedCityList = rawCityList.filter((city) => city !== undefined);
    console.log(this.parsedCityList);
  }

  initializePassengerFormGroup = () => {
    this.passengerFormGroup = new FormGroup({
      otp: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      middlename: new FormControl(''),
      gender: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      contactNumber: new FormControl('', Validators.required),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      currentAddress: new FormControl('', Validators.required),
      homeAddress: new FormControl('', Validators.required),
      // Account Details
      p_username: new FormControl('', Validators.required),
      p_password: new FormControl('', Validators.required),
      p_confirmPassword: new FormControl('', Validators.required),
    });
  };

  initializeBusDriverFormGroup = () => {
    this.busDriverFormGroup = new FormGroup({
      // Bus Details
      otp: new FormControl('', Validators.required),
      busName: new FormControl('', Validators.required),
      busNumber: new FormControl('', Validators.required),
      busProvince: new FormControl('', Validators.required),
      // Operator Details
      operatorFullName: new FormControl('', Validators.required),
      operatorPosition: new FormControl('', Validators.required),
      operatorPhoneNumber: new FormControl('', Validators.required),
      operatorEmail: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      acceptHighTemp: new FormControl('', Validators.required),
      acceptNoVaccination: new FormControl('', Validators.required),
      // Account Details
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  };

  handleChangeCategory = (selCategory: string) => {
    this.category = selCategory;
    this.passengerStepControls = '';
    console.log(this.category);
    if (selCategory === '') {
      if (this.passengerFormGroup && this.passengerFormGroup.controls) {
        Object.keys(this.passengerFormGroup.controls).forEach((key) => {
          const control = this.passengerFormGroup.get(key);
          if (control) control.setErrors(null);
        });
      }
      this.passengerFormGroup.reset();
      console.log('passenger', this.passengerFormGroup);

      if (this.busDriverFormGroup && this.busDriverFormGroup.controls) {
        Object.keys(this.busDriverFormGroup.controls).forEach((key) => {
          const control = this.busDriverFormGroup.get(key);
          if (control) control.setErrors(null);
        });
      }
      this.busDriverFormGroup.reset();
      this.busDriverSuccessRegister = true;
    }
  };

  handleNextRegistrationPassenger = (wizardRoute: string) => {
    this.passengerStepControls = wizardRoute ? wizardRoute : '';
  };

  handleNextRegistrationBusDriver = (wizardRoute: string) => {
    this.busdriverStepControls = wizardRoute ? wizardRoute : '';
  };

  handleSubmitPassengerForm = () => {
    console.log('passenger form submitted', this.passengerFormGroup);
    // basic info
    const otp = this.passengerFormGroup.get('otp');
    const lastname = this.passengerFormGroup.get('lastname');
    const firstname = this.passengerFormGroup.get('firstname');
    const middlename = this.passengerFormGroup.get('middlename');
    const gender = this.passengerFormGroup.get('gender');
    const birthdate = this.passengerFormGroup.get('birthdate');
    // contact info
    const contactNumber = this.passengerFormGroup.get('contactNumber');
    const emailAddress = this.passengerFormGroup.get('emailAddress');
    const currentAddress = this.passengerFormGroup.get('currentAddress');
    const homeAddress = this.passengerFormGroup.get('homeAddress');
    // account info
    const p_username = this.passengerFormGroup.get('p_username');
    const p_password = this.passengerFormGroup.get('p_password');

    // prep request body
    const passengerBody = {
      Lastname: lastname && lastname.value ? lastname.value : '',
      Firstname: firstname && firstname.value ? firstname.value : '',
      Middlename: middlename && middlename.value ? middlename.value : '',
      Gender: gender && gender.value ? gender.value : '',
      Birthdate: birthdate && birthdate.value ? birthdate.value : '',
      ActiveContactNumber:
        contactNumber && contactNumber.value ? contactNumber.value : '',
      ActiveEmailAdd:
        emailAddress && emailAddress.value ? emailAddress.value : '',
      CurrentAddress:
        currentAddress && currentAddress.value ? currentAddress.value : '',
      HomeAddress: homeAddress && homeAddress.value ? homeAddress.value : '',
      Username: p_username && p_username.value ? p_username.value : '',
      Password: p_password && p_password.value ? p_password.value : '',
    };

    console.log('p payload', passengerBody);

    // call api service
    if (this.OTPCode === otp?.value) {
      this.passSakayAPIService
      .addPassenger(passengerBody)
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(response.error.message, 'Got it');
        }
        if (response && response.passengerData) {
          this.generateQRCode(response.passengerData);
          this.handleChangeCategory('pass-registration-complete');
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
    } else {
      this.snackBarService.open(
        'Incorrect OTP Code.',
        'Try again'
      );
    }
  };

  generateQRCode = (data: any) => {
    console.log('generating qr code', data);
    this.qrPassengerData = data;
    this.qrData = JSON.stringify({
      passenger: data.secret_id,
    });
  };

  handleInputErrors = (controlName: string, errName: string) => {
    return this.passengerFormGroup.controls[controlName].hasError(errName);
  };

  handleBusDriverInputErrors = (controlName: string, errName: string) => {
    return this.busDriverFormGroup.controls[controlName].hasError(errName);
  };

  saveBusDriver = (body: Object) => {
    // TODO: call api service for saving bus details (endpoint not yet available)
    this.passSakayAPIService
      .addBusDriver(body)
      .then((response: any) => {
        if (!response)
          this.snackBarService.open(
            'Registration failed. Check your network.',
            'OK'
          );
        if (response && response._id) {
          this.newBusDriver = response;
          this.snackBarService.open('Registration success.', 'OK');
          // this.busDriverSuccessRegister = true;
          this.category = 'bus-driver-registration-complete';
          this.sendBusOTPForm = false;
        }
      })
      .catch((err) => {
        console.error(err);
        this.snackBarService.open(
          'Registration failed. Check your network.',
          'OK'
        );
      });
  };

  handleSubmitRegistrationBusDriver = async () => {
    console.log(this.busDriverFormGroup);
    // bus basic info
    const otp = this.busDriverFormGroup.get('otp');
    const busName = this.busDriverFormGroup.get('busName');
    const busNumber = this.busDriverFormGroup.get('busNumber');
    const busProvince = this.busDriverFormGroup.get('busProvince');
    // bus account info
    const username = this.busDriverFormGroup.get('username');
    const password = this.busDriverFormGroup.get('password');
    // bus operator info
    const operatorFullName = this.busDriverFormGroup.get('operatorFullName');
    const operatorPosition = this.busDriverFormGroup.get('operatorPosition');
    const operatorPhoneNumber = this.busDriverFormGroup.get(
      'operatorPhoneNumber'
    );
    const operatorEmail = this.busDriverFormGroup.get('operatorEmail');

    // bus basic info request body
    const busBasicInfoBody = {
      BusName: busName && busName.value ? busName.value : '',
      BusNumber: busNumber && busNumber.value ? busNumber.value : '',
      BusProvince: busProvince && busProvince.value ? busProvince.value : '',
      OperatorFullName:
        operatorFullName && operatorFullName.value
          ? operatorFullName.value
          : '',
      OperatorPosition: 'Conductor',
      OperatorPhoneNumber:
        operatorPhoneNumber && operatorPhoneNumber.value
          ? operatorPhoneNumber.value
          : '',
      Username: username && username.value ? username.value : '',
      Password: password && password.value ? password.value : '',
      Email: operatorEmail && operatorEmail.value ? operatorEmail.value : '',
    };
    if (this.OTPCode === otp?.value) {
      this.saveBusDriver(busBasicInfoBody);
    } else {
      this.snackBarService.open(
        'Incorrect OTP Code.',
        'Try again'
      );
    }
  };

  handleDownloadQRCode = () => {
    console.log('qr downloaded!');
  };

  numberOnly = (event: any): boolean => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  };

  gotoLoginPage = () => {
    this.router.navigate(['/welcome/login']);
  };

  toggleBusSendOTP = () => {
    const operatorEmail = this.busDriverFormGroup.get('operatorEmail');
    const operatorFullName = this.busDriverFormGroup.get('operatorFullName');
    this.busdriverStepControls = "bus-driver-otp"
    this.sendBusOTPForm = true;
    this.OTPEmail = operatorEmail?.value;
    this.OTPName = operatorFullName?.value;
    this.sendOTPCode(this.OTPEmail, this.OTPName);
  }

  togglePassengerSendOTP = () => {
    const emailAddress = this.passengerFormGroup.get('emailAddress');
    const lastname = this.passengerFormGroup.get('lastname');
    const firstname = this.passengerFormGroup.get('firstname');
    this.sendPassengerOTPForm = true;
    this.OTPEmail = emailAddress?.value;
    this.OTPName = lastname?.value + " " + firstname?.value;
    this.sendOTPCode(this.OTPEmail, this.OTPName);
    this.passengerStepControls = "passenger-otp"
  }

  makeOTPCode(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  sendOTPCode = (email: string, name: string) => {
    this.OTPCode = this.makeOTPCode(6);
    console.log(this.OTPCode);
    if (this.OTPCode) {
      const body = {
        email: email,
        name: name,
        OTP: this.OTPCode,
      };
      this.passSakayAPIService.sendMail(body)
        .then((data: any) => {
          console.log(data);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  ngDoCheck(): void {
    if (this.category === 'passenger' && this.passengerStepControls === '') {
      const lastname = this.passengerFormGroup.get('lastname');
      const firstname = this.passengerFormGroup.get('firstname');
      const middlename = this.passengerFormGroup.get('middlename');
      const gender = this.passengerFormGroup.get('gender');
      const birthdate = this.passengerFormGroup.get('birthdate');
      if (
        lastname &&
        lastname.value !== '' &&
        lastname.value !== null &&
        firstname &&
        firstname.value !== '' &&
        firstname.value !== null &&
        gender &&
        gender.value !== '' &&
        gender.value !== null &&
        birthdate &&
        birthdate.value !== '' &&
        birthdate.value !== null
      ) {
        this.disableBasicInfoNext = false;
      } else {
        this.disableBusBasicInfoNext = true;
      }
    }

    if (
      this.category === 'passenger' &&
      this.passengerStepControls === 'passenger-contact'
    ) {
      const contactNumber = this.passengerFormGroup.get('contactNumber');
      const emailAddress = this.passengerFormGroup.get('emailAddress');
      const currentAddress = this.passengerFormGroup.get('currentAddress');
      const homeAddress = this.passengerFormGroup.get('homeAddress');

      if (
        contactNumber &&
        contactNumber.value !== '' &&
        contactNumber.value !== '' &&
        currentAddress &&
        currentAddress.value !== '' &&
        currentAddress.value !== '' &&
        homeAddress &&
        homeAddress.value !== '' &&
        homeAddress.value !== ''
      ) {
        this.disableContactInfoNext = false;
      } else {
        this.disableContactInfoNext = true;
      }
    }

    if (
      this.category === 'passenger' &&
      this.passengerStepControls === 'passenger-account'
    ) {
      const p_username = this.passengerFormGroup.get('p_username');
      const p_password = this.passengerFormGroup.get('p_password');
      const p_confirmPassword =
        this.passengerFormGroup.get('p_confirmPassword');

      if (
        p_username &&
        p_confirmPassword &&
        p_password &&
        p_username.value !== '' &&
        p_username.value !== null &&
        p_confirmPassword.value !== '' &&
        p_confirmPassword.value !== null &&
        p_password.value !== '' &&
        p_password.value !== null
      ) {
        if (p_password.value === p_confirmPassword.value) {
          this.disableAccountInfoNext = false;
        } else {
          this.disableAccountInfoNext = true;
        }
      } else {
        this.disableAccountInfoNext = true;
      }
    }

    if (this.category === 'passenger' && this.passengerStepControls === 'passenger-otp') {
      const otp = this.passengerFormGroup.get('otp');

      if (
        otp &&
        otp.value !== ''
      ) {
        this.disableSuccessRegister = false;
      } else {
        this.disableSuccessRegister = true;
      }
    }

    if (this.category === 'bus-driver' && this.busdriverStepControls === '') {
      const busName = this.busDriverFormGroup.get('busName');
      const busNumber = this.busDriverFormGroup.get('busNumber');
      const busProvince = this.busDriverFormGroup.get('busProvince');

      if (
        busName &&
        busName.value !== '' &&
        busName.value !== null &&
        busProvince &&
        busProvince.value !== '' &&
        busProvince.value !== null &&
        busNumber &&
        busNumber.value !== '' &&
        busNumber.value !== null
      ) {
        this.disableBusBasicInfoNext = false;
      } else {
        this.disableBusBasicInfoNext = true;
      }
    }

    if (this.category === 'bus-driver' && this.busdriverStepControls === 'bus-driver-otp') {
      const otp = this.busDriverFormGroup.get('otp');

      if (
        otp &&
        otp.value !== ''
      ) {
        this.busDriverSuccessRegister = false;
      } else {
        this.busDriverSuccessRegister = true;
      }
    }

    if (
      this.category === 'bus-driver' &&
      this.busdriverStepControls === 'bus-driver-incharge'
    ) {
      const operatorFullName = this.busDriverFormGroup.get('operatorFullName');
      const operatorPosition = this.busDriverFormGroup.get('operatorPosition');
      const operatorPhoneNumber = this.busDriverFormGroup.get(
        'operatorPhoneNumber'
      );
      const operatorEmail = this.busDriverFormGroup.get('operatorEmail');

      if (
        operatorFullName &&
        operatorFullName.value !== '' &&
        operatorFullName.value !== null &&
        operatorPhoneNumber &&
        operatorPhoneNumber.value !== '' &&
        operatorPhoneNumber.value !== null &&
        operatorEmail &&
        operatorEmail.value !== '' &&
        operatorEmail.value !== null
      ) {
        this.disableBusOperatorInfoNext = false;
      } else {
        this.disableBusBasicInfoNext = true;
      }
    }

    if (
      this.category === 'bus-driver' &&
      this.busdriverStepControls === 'bus-driver-tempVac'
    ) {
      const temp = this.busDriverFormGroup.get('acceptHighTemp');
      const vaccine = this.busDriverFormGroup.get('acceptNoVaccination');

      if (
        temp &&
        temp.value !== '' &&
        temp.value !== null &&
        vaccine &&
        vaccine.value !== '' &&
        vaccine.value !== null
      ) {
        this.disableBusOperatorScanOptNext = false;
      } else {
        this.disableBusOperatorScanOptNext = true;
      }
    }

    if (
      this.category === 'bus-driver' &&
      this.busdriverStepControls === 'bus-driver-account'
    ) {
      const username = this.busDriverFormGroup.get('username');
      const password = this.busDriverFormGroup.get('password');
      const confirmPassword = this.busDriverFormGroup.get('confirmPassword');

      if (
        username &&
        confirmPassword &&
        password &&
        username.value !== '' &&
        username.value !== null &&
        confirmPassword.value !== '' &&
        confirmPassword.value !== null &&
        password.value !== '' &&
        password.value !== null
      ) {
        if (password.value === confirmPassword.value) {
          this.disableBusAccountInfoNext = false;
        } else {
          this.disableBusAccountInfoNext = true;
        }
      } else {
        this.disableBusAccountInfoNext = true;
      }
    }
  }
}
