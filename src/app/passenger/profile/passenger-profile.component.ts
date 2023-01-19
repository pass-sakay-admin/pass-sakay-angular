import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbDate,
  NgbDateStruct,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/services/auth.service';
import {
  Subject,
  OperatorFunction,
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  merge,
  map,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-passenger-profile',
  templateUrl: './passenger-profile.component.html',
  styleUrls: ['./passenger-profile.component.scss'],
})
export class PassengerProfileComponent implements OnInit {
  @ViewChild('typeAheadInstance', { static: true })
  typeAheadInstance!: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model!: NgbDateStruct;

  public genderList: Array<string> = ['Male', 'Female'];
  public passengerData: any = {};
  public passengerQRData!: string;
  public editMode: boolean = false;
  public passengerDataFormGroup!: FormGroup;

  constructor(
    private authService: AuthService,
    private passSakayAPIService: PassSakayCollectionService,
    private snackBarService: MatSnackBar
  ) {}
  ngOnInit() {
    this.initPassengerProfileFormGroup();

    const loginData = this.authService.checkAuth(environment.STORAGE_KEY).data;
    const parsedLoginData = JSON.parse(loginData);
    console.log('passenger', parsedLoginData);
    this.initPassengerData(parsedLoginData._userId);
  }

  initPassengerProfileFormGroup = () => {
    this.passengerDataFormGroup = new FormGroup({
      lastname: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      middlename: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      emailAddress: new FormControl('', Validators.required),
      currentAddress: new FormControl('', Validators.required),
      homeAddress: new FormControl('', Validators.required),
    });
  };

  initPassengerData = (id: any) => {
    this.passSakayAPIService
      .getOnePassengerData(id)
      .then((response: any) => {
        if (response.error) {
          console.log(response);
          this.snackBarService.open(
            response.error.message.error_message,
            'Got it'
          );
        }
        if (!response.error) {
          this.passengerQRData = JSON.stringify({
            passenger: response._id,
          });
          this.setFormValues(response);
          this.passengerData = response;
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
    // this.passengerData = []
  };

  setFormValues = (data: any) => {
    const lastname = this.passengerDataFormGroup.get('lastname');
    const firstname = this.passengerDataFormGroup.get('firstname');
    const middlename = this.passengerDataFormGroup.get('middlename');
    const gender = this.passengerDataFormGroup.get('gender');
    const birthdate = this.passengerDataFormGroup.get('birthdate');
    const phoneNumber = this.passengerDataFormGroup.get('phoneNumber');
    const emailAddress = this.passengerDataFormGroup.get('emailAddress');
    const currentAddress = this.passengerDataFormGroup.get('currentAddress');
    const homeAddress = this.passengerDataFormGroup.get('homeAddress');

    const dateObj = new Date(data.birthdate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const birthDateValue = new NgbDate(year, month, day);

    lastname?.setValue(data.lastname);
    firstname?.setValue(data.firstname);
    middlename?.setValue(data.middlename);
    gender?.setValue(data.gender);
    birthdate?.setValue(birthDateValue);
    phoneNumber?.setValue(data.phoneNumber);
    emailAddress?.setValue(data.email);
    currentAddress?.setValue(data.currentAddress);
    homeAddress?.setValue(data.homeAddress);
  };

  autoCompleteGender: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.typeAheadInstance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === ''
          ? this.genderList
          : this.genderList.filter(
              (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  editPassengerData = () => {
    this.editMode = !this.editMode;
  };

  onSavePassengerData = () => {};

  generateImage(){
    var node:any = document.getElementById('image-section');
    htmlToImage.toPng(node)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        const link = document.createElement("a");
        link.download = "passenger-qr.png";
        link.href = "data:" + img.src;
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  ngDoCheck(): void {
    // const field = this.passengerDataFormGroup.get('')
    if (this.editMode) {
      Object.keys(this.passengerDataFormGroup.controls).forEach((key: any) => {
        this.passengerDataFormGroup.controls[key].enable();
      });
    } else {
      this.setFormValues(this.passengerData);
      Object.keys(this.passengerDataFormGroup.controls).forEach((key: any) => {
        this.passengerDataFormGroup.controls[key].disable();
      });
    }
  }
}
