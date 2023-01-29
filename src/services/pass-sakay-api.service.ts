import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login } from 'src/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PassSakayCollectionService {
  constructor(
    private httpClientNoInterceptor: HttpClient
  ) { }

  private httpHeaders: { [key:string]: string } = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  }

  public addPassenger(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiAddPassenger(body).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiAddPassenger(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'passengers';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => {
        return data
      }));
  }

  public updatePassenger(body: any, id: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiUpdatePassenger(body, id).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiUpdatePassenger(body: any, id: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'passengers/' + id;
    return this.httpClientNoInterceptor
      .put(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => {
        return data
      }));
  }

  public addBusDriver(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiAddBusDriver(body).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiAddBusDriver(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'bus-drivers';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public updateBusAccount(body: any, id: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiUpdateBusAccount(body, id).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiUpdateBusAccount(body: any, id: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'bus-drivers/' + id;
    return this.httpClientNoInterceptor
      .put(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => {
        return data
      }));
  }

  public addAccount(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiAddAccount(body).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiAddAccount(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'accounts';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getOnePassengerData(id: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetOnePassengerData(id).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetOnePassengerData(id: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'passengers/' + id.toString();
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getOneBusAccountData(id: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetOneBusAccountData(id).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetOneBusAccountData(id: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'bus-drivers/' + id.toString();
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public saveScannedPassengerData(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiSaveScannedPassengerData(body).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiSaveScannedPassengerData(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getAllPassengerData(): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllPassengerData().subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllPassengerData(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'passengers/';
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getAllBusAccountData(): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllBusAccountData().subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllBusAccountData(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'bus-drivers/';
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getAllTripScheduleData(): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllTripScheduleData().subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllTripScheduleData(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'trip-schedules/';
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getOneTripScheduleData(id: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetOneTripScheduleData(id).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetOneTripScheduleData(id: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'trip-schedules/' + id.toString();
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public updateTripSchedule(body: any, id: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiUpdateTripSchedule(body, id).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiUpdateTripSchedule(body: any, id: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'trip-schedules/' + id;
    return this.httpClientNoInterceptor
      .put(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => {
        return data
      }));
  }

  public getAllTripHistoryDataViaPassenger(id: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllTripHistoryDataViaPassenger(id).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllTripHistoryDataViaPassenger(id: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/trip-history/' + id;
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getAllTripHistoryDataViaBusAccount(id: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllTripHistoryDataViaBusAccount(id).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllTripHistoryDataViaBusAccount(id: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/bus-account/' + id;
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getAllTripHistoryData(): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllTripHistoryData().subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllTripHistoryData(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/';
    return this.httpClientNoInterceptor
      .get(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getAllTripHistoryReport(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetAllTripHistoryReport(body).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetAllTripHistoryReport(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/reports';
    return this.httpClientNoInterceptor
      .post(endpoint, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getTripHistoryCount(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetTripHistoryCount(body).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetTripHistoryCount(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/get/count';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getPassengerCount(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetPassengerCount(body).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetPassengerCount(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'passengers/get/count';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getBusAccountsCount(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetBusAccountsCount(body).subscribe((data: Object) => {
        resolve(data);
      }),
        (err: any): void => {
          reject(err);
        };
    });
  }
  private apiGetBusAccountsCount(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'bus-drivers/get/count';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public saveNewPositiveCase(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apisaveNewPositiveCase(body).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apisaveNewPositiveCase(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + '/positive-case';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getTripHistoryOfPositive(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetTripHistoryOfPositive(body).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiGetTripHistoryOfPositive(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/get/trip-history';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public getCloseContacts(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apiGetCloseContacts(body).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apiGetCloseContacts(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + 'scanned-qr/get/close-contacts';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }

  public sendMail(body: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.apisendMail(body).subscribe((data: Object) => {
        resolve(data);
      }),
      (err: any): void => {
        reject(err);
      };
    });
  }
  private apisendMail(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(this.httpHeaders);
    const endpoint = environment.api_base_url + '/auth/test-mail';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(map((data: Object) => data));
  }
}
