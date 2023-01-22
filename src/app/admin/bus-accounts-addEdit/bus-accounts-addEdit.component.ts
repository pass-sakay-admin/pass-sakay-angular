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
  selector: 'app-bus-accounts-addEdit',
  templateUrl: './bus-accounts-addEdit.component.html',
  styleUrls: ['./bus-accounts-addEdit.component.scss'],
})
export class BusAccountAddEditComponent implements OnInit {
  @ViewChild('typeAheadInstance', { static: true })
  typeAheadInstance!: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model!: NgbDateStruct;

  public genderList: Array<string> = ['Male', 'Female'];
  public busAccountData: { [key:string]: string } = {};
  public passengerQRData!: string;
  public editMode: boolean = false;
  public busAccountDataFormGroup!: FormGroup;
  
  public formMode: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private passSakayAPIService: PassSakayCollectionService,
    private snackBarService: MatSnackBar
  ) {}
  ngOnInit() {
    this.initBusAccountFormGroup();

    this.route.params.subscribe(params => {
      console.log(params)
      console.log(params['id'])
      if (params['id'] === 'add') {
        this.formMode = "Create"
        this.editMode = false;
      } else {
        this.formMode = "Update"
        this.editMode = true;
        this.initBusAccountData(params['id']);
      }
    });
  }

  initBusAccountFormGroup = () => {
    this.busAccountDataFormGroup = new FormGroup({
      // Bus Details
      busName: new FormControl('', Validators.required),
      busNumber: new FormControl('', Validators.required),
      busProvince: new FormControl('', Validators.required),
      // Operator Details
      operatorFullName: new FormControl('', Validators.required),
      operatorPosition: new FormControl('', Validators.required),
      operatorPhoneNumber: new FormControl('', Validators.required),
      operatorEmail: new FormControl('',),
      // Account Details
      status: new FormControl('', Validators.required),
      isApproved: new FormControl('', Validators.required),
    });
  };

  initBusAccountData = (id: any) => {
    this.passSakayAPIService
    .getOneBusAccountData(id)
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
          this.busAccountData = response;
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
    // this.busAccountData = []
  };

  setFormValues = (data: any) => {
    const busName = this.busAccountDataFormGroup.get('busName');
    const busNumber = this.busAccountDataFormGroup.get('busNumber');
    const busProvince = this.busAccountDataFormGroup.get('busProvince');
    const operatorFullName = this.busAccountDataFormGroup.get('operatorFullName');
    const operatorPhoneNumber = this.busAccountDataFormGroup.get('operatorPhoneNumber');
    const operatorPosition = this.busAccountDataFormGroup.get('operatorPosition');
    const isApproved = this.busAccountDataFormGroup.get('isApproved');
    const status = this.busAccountDataFormGroup.get('status');

    const dateObj = new Date(data.birthdate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const birthDateValue = new NgbDate(year, month, day);

    busName?.setValue(data.busName);
    busNumber?.setValue(data.busNumber);
    busProvince?.setValue(data.busProvince);
    operatorFullName?.setValue(data.operatorFullName);
    operatorPhoneNumber?.setValue(data.operatorPhoneNumber);
    operatorPosition?.setValue(data.operatorPosition);
    isApproved?.setValue(data.isApproved ? "Approved" : "Disapproved");
    status?.setValue(data.status ? "Active" : "Inactive");

    console.log(this.busAccountDataFormGroup.get('status'))
  };

  
  onCancelAddEdit = () => {
    Object.keys(this.busAccountDataFormGroup.controls).forEach(key => {
      const control = this.busAccountDataFormGroup.get(key);
      if (control) {
        control.setErrors(null);
        control.setValue(null);
      }
    });
    this.busAccountDataFormGroup.markAsPristine();
    this.busAccountDataFormGroup.markAsUntouched();
    this.router.navigate(['/admin/bus-accounts']);
  };

  onSaveBusAccountData = () => {
    console.log('passenger form submitted', this.busAccountDataFormGroup);
    const status = this.busAccountDataFormGroup.get('status');
    const isApproved = this.busAccountDataFormGroup.get('isApproved');

    // prep request body
    const body = {
      Status: status && status.value === "Active" ? true : false,
      isApproved: isApproved && isApproved.value === "Approved" ? true : false,
    }

    console.log("p payload", body)

    // call api service
    this.passSakayAPIService.updateBusAccount(body, this.busAccountData['_id'])
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(response.error.message, 'Got it');
        }
        if (response && response._id) {
          this.snackBarService.open("Bus account successfully updated.", 'Got it');
        }
      })
      .catch((err: any) => {
        console.log("update bus account error", err);
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
    // const field = this.busAccountDataFormGroup.get('')
    if (this.editMode) {
      Object.keys(this.busAccountDataFormGroup.controls).forEach((key: any) => {
        if (!["status", "isApproved"].includes(key)) {
          this.busAccountDataFormGroup.controls[key].disable();
        }
      });
    } else {
      Object.keys(this.busAccountDataFormGroup.controls).forEach((key: any) => {
        this.busAccountDataFormGroup.controls[key].enable();
      });
    }
  }
}
