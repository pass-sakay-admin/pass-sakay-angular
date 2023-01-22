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
  selector: 'app-trip-schedules-addEdit',
  templateUrl: './trip-schedules-addEdit.component.html',
  styleUrls: ['./trip-schedules-addEdit.component.scss'],
})
export class TripScheduleAddEditComponent implements OnInit {
  @ViewChild('typeAheadInstance', { static: true })
  typeAheadInstance!: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model!: NgbDateStruct;

  public genderList: Array<string> = ['Male', 'Female'];
  public tripScheduleData: { [key:string]: string } = {};
  public passengerQRData!: string;
  public editMode: boolean = false;
  public tripScheduleDataFormGroup!: FormGroup;
  
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
    this.tripScheduleDataFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      daysRoutine: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      startingPoint: new FormControl('', Validators.required),
      finishingPoint: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
    });
  };

  initBusAccountData = (id: any) => {
    this.passSakayAPIService
    .getOneTripScheduleData(id)
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(
            response.error.message.message,
            'Got it'
          );
        }
        if (!response.error) {
          console.log(response)
          this.setFormValues(response);
          this.tripScheduleData = response;
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
    // this.tripScheduleData = []
  };

  setFormValues = (data: any) => {
    const name = this.tripScheduleDataFormGroup.get('name');
    const busAccount = this.tripScheduleDataFormGroup.get('busAccount');
    const daysRoutine = this.tripScheduleDataFormGroup.get('daysRoutine');
    const startTime = this.tripScheduleDataFormGroup.get('startTime');
    const endTime = this.tripScheduleDataFormGroup.get('endTime');
    const startingPoint = this.tripScheduleDataFormGroup.get('startingPoint');
    const finishingPoint = this.tripScheduleDataFormGroup.get('finishingPoint');
    const status = this.tripScheduleDataFormGroup.get('status');

    const dateObj = new Date(data.birthdate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const birthDateValue = new NgbDate(year, month, day);

    name?.setValue(data.name);
    busAccount?.setValue(data.busAccount);
    daysRoutine?.setValue(data.daysRoutine);
    startTime?.setValue(data.startTime);
    endTime?.setValue(data.endTime);
    startingPoint?.setValue(data.startingPoint);
    finishingPoint?.setValue(data.finishingPoint);
    status?.setValue(data.status ? "Active" : "Inactive");

    console.log(this.tripScheduleDataFormGroup.get('status'))
  };

  
  onCancelAddEdit = () => {
    Object.keys(this.tripScheduleDataFormGroup.controls).forEach(key => {
      const control = this.tripScheduleDataFormGroup.get(key);
      if (control) {
        control.setErrors(null);
        control.setValue(null);
      }
    });
    this.tripScheduleDataFormGroup.markAsPristine();
    this.tripScheduleDataFormGroup.markAsUntouched();
    this.router.navigate(['/admin/trip-schedules']);
  };

  onSaveTripScheduleData = () => {
    console.log('passenger form submitted', this.tripScheduleDataFormGroup);
    const status = this.tripScheduleDataFormGroup.get('status');

    // prep request body
    const body = {
      Status: status && status.value === "Active" ? true : false,
    }

    // call api service
    this.passSakayAPIService.updateTripSchedule(body, this.tripScheduleData['_id'])
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(response.error.message, 'Got it');
        }
        if (response && response._id) {
          this.snackBarService.open("Trip schedule successfully updated.", 'Got it');
        }
      })
      .catch((err: any) => {
        console.log("update trip sched error", err);
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
    // const field = this.tripScheduleDataFormGroup.get('')
    if (this.editMode) {
      Object.keys(this.tripScheduleDataFormGroup.controls).forEach((key: any) => {
        if (!["status", "isApproved"].includes(key)) {
          this.tripScheduleDataFormGroup.controls[key].disable();
        }
      });
    } else {
      Object.keys(this.tripScheduleDataFormGroup.controls).forEach((key: any) => {
        this.tripScheduleDataFormGroup.controls[key].enable();
      });
    }
  }
}
