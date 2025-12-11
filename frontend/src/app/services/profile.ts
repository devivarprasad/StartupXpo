import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { ProfileData } from '../profile/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profile: ProfileData | null = null;

  constructor(private api: ApiService) {}

  loadProfile(): Observable<ProfileData> {
    return this.api.get('users/me');
  }

  setProfile(data: ProfileData) {
    this.profile = data;
  }

  getProfile(): ProfileData | null {
    return this.profile;
  }
}
