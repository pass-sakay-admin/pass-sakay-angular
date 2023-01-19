import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(
    @Inject(LOCAL_STORAGE)
    private storage: StorageService
  ) {}

  public set(key: string, data: any): void {
    this.storage.set(key, data);
  }

  public get(key: any): any {
    return this.storage.get(key);
  }

  public removeAll(): void {
    this.storage.clear();
  }

  public removeOne(key: string): void {
    this.storage.remove(key);
  }
}
