import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-passenger-addEdit',
  templateUrl: './passenger-addEdit.component.html',
  styleUrls: ['./passenger-addEdit.component.scss'],
})
export class PassengerAddEditComponent implements OnInit {
  @ViewChild('typeAheadInstance', { static: true })
  typeAheadInstance!: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model!: NgbDateStruct;

  public genderList: Array<string> = ['Male', 'Female'];
  public passengerData: { [key:string]: string } = {};
  public passengerQRData!: string;
  public editMode: boolean = false;
  public passengerDataFormGroup!: FormGroup;
  
  public formMode: string = "";
  public passengerId: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private passSakayAPIService: PassSakayCollectionService,
    private snackBarService: MatSnackBar
  ) {}
  ngOnInit() {
    this.initPassengerProfileFormGroup();

    this.route.params.subscribe(params => {
      console.log(params)
      console.log(params['id'])
      if (params['id'] === 'add') {
        this.formMode = "Create"
        this.editMode = false;
      } else {
        this.formMode = "Update"
        this.editMode = true;
        this.initPassengerData(params['id']);
      }
    });
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
      status: new FormControl('', Validators.required),
    });
  };

  initPassengerData = (id: any) => {
    this.passSakayAPIService
      .getOnePassengerData(id)
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(
            response.error.message.error_message,
            'Got it'
          );
        }
        if (!response.error) {
          console.log(response)
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
    const status = this.passengerDataFormGroup.get('status');

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
    status?.setValue(data.status ? "Active" : "Inactive");

    console.log(this.passengerDataFormGroup.get('status'))
  };

  
  onCancelAddEdit = () => {
    Object.keys(this.passengerDataFormGroup.controls).forEach(key => {
      const control = this.passengerDataFormGroup.get(key);
      if (control) {
        control.setErrors(null);
        control.setValue(null);
      }
    });
    this.passengerDataFormGroup.markAsPristine();
    this.passengerDataFormGroup.markAsUntouched();
    this.router.navigate(['/admin/passengers']);
  };

  onSavePassengerData = () => {
    console.log('passenger form submitted', this.passengerDataFormGroup);
    // basic info
    // const lastname = this.passengerDataFormGroup.get('lastname');
    // const firstname = this.passengerDataFormGroup.get('firstname');
    // const middlename = this.passengerDataFormGroup.get('middlename');
    // const gender = this.passengerDataFormGroup.get('gender');
    // const birthdate = this.passengerDataFormGroup.get('birthdate');
    // contact info
    // const contactNumber = this.passengerDataFormGroup.get('contactNumber');
    // const emailAddress = this.passengerDataFormGroup.get('emailAddress');
    // const currentAddress = this.passengerDataFormGroup.get('currentAddress');
    // const homeAddress = this.passengerDataFormGroup.get('homeAddress');
    const status = this.passengerDataFormGroup.get('status');

    // prep request body
    const passengerBody = {
      // Lastname: lastname && lastname.value ? lastname.value : "",
      // Firstname: firstname && firstname.value ? firstname.value : "",
      // Middlename: middlename && middlename.value ? middlename.value : "",
      // Gender: gender && gender.value ? gender.value : "",
      // Birthdate: birthdate && birthdate.value ? birthdate.value : "",
      // ActiveContactNumber: contactNumber && contactNumber.value ? contactNumber.value : "",
      // ActiveEmailAdd: emailAddress && emailAddress.value ? emailAddress.value : "",
      // CurrentAddress: currentAddress && currentAddress.value ? currentAddress.value : "",
      // HomeAddress: homeAddress && homeAddress.value ? homeAddress.value : "",
      Status: status && status.value === "Active" ? true : false,
    }

    console.log("p payload", passengerBody)

    // call api service
    this.passSakayAPIService.updatePassenger(passengerBody, this.passengerData['_id'])
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(response.error.message, 'Got it');
        }
        if (response && response._id) {
          this.snackBarService.open("Passenger successfully updated.", 'Got it');
        }
      })
      .catch((err: any) => {
        console.log("update passenger error", err);
      });
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

  ngDoCheck(): void {
    // const field = this.passengerDataFormGroup.get('')
    if (this.editMode) {
      Object.keys(this.passengerDataFormGroup.controls).forEach((key: any) => {
        if (key !== "status") {
          this.passengerDataFormGroup.controls[key].disable();
        }
      });
    } else {
      Object.keys(this.passengerDataFormGroup.controls).forEach((key: any) => {
        this.passengerDataFormGroup.controls[key].enable();
      });
    }
  }
}
