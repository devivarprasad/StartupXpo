import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { SignupLogin } from './signup-login/signup-login';
import { DashBoard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'signup-login', component: SignupLogin },
  { path: 'dashboard', component: DashBoard },
];
