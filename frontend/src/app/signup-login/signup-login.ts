import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface SignupForm {
  username: string;
  password: string;
  role: 'founder' | 'investor';
}

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  type: string | null;
  username: string;
  message: string;
  role: string;
}

@Component({
  selector: 'app-signup-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-login.html',
  styleUrl: './signup-login.css'
})
export class SignupLogin {
  activeTab: 'signup' | 'login' = 'signup';
  userType: 'founder' | 'investor' = 'founder';
  
  signupForm: SignupForm = {
    username: '',
    password: '',
    role: 'founder'
  };
  
  loginForm: LoginForm = {
    username: '',
    password: ''
  };
  
  signupError: string = '';
  loginError: string = '';
  isSigningUp: boolean = false;
  isLoggingIn: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] ;
      this.userType = params['type'] || 'founder';
      this.signupForm.role = this.userType;
    });
  }

  switchTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab},
      queryParamsHandling: 'merge',
    });
  }


  onSignupSubmit() {
    // Clear previous errors
    this.signupError = '';
    
    // Validate form
    if (!this.signupForm.username || !this.signupForm.password) {
      this.signupError = 'Please fill in all required fields';
      return;
    }

    // Ensure role is synced with userType
    this.signupForm.role = this.userType;
    
    // Set loading state
    this.isSigningUp = true;

    // Make API call
    this.http.post(`${environment.apiUrl}/auth/signup`, {
      username: this.signupForm.username,
      password: this.signupForm.password,
      role: this.signupForm.role
    }).subscribe({
      next: (response) => {
        this.isSigningUp = false;
        console.log('Signup successful:', response);
        // Reset form
        this.signupForm = {
          username: '',
          password: '',
          role: this.userType
        };
        // Optionally redirect to login
        this.router.navigate(['/signup-login'], { queryParams: { tab: 'login' } });
      
      },
      error: (error: HttpErrorResponse) => {
        this.isSigningUp = false;
        console.error('Signup error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error error:', error.error);
        console.error('Error headers:', error.headers);
        
        // Handle error response
        if (error.status === 403) {
          this.signupError = 'Access forbidden. This might be a CORS issue. Please ensure the backend allows requests from this origin.';
        } else if (error.status === 0) {
          this.signupError = 'Cannot connect to the server. Please ensure the backend is running on http://localhost:8080';
        } else if (error.error && error.error.message) {
          this.signupError = error.error.message;
        } else if (error.status === 409) {
          this.signupError = 'Username already exists. Please choose a different username.';
        } else if (error.status === 400) {
          this.signupError = 'Invalid form data. Please check your input.';
        } else {
          this.signupError = `Signup failed (Status: ${error.status}). Please try again later.`;
        }
      }
    });
  }

  onLoginSubmit() {
    // Clear previous errors
    this.loginError = '';
    
    // Validate form
    if (!this.loginForm.username || !this.loginForm.password) {
      this.loginError = 'Please fill in all required fields';
      return;
    }
    
    // Set loading state
    this.isLoggingIn = true;

    // Make API call
    this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      username: this.loginForm.username,
      password: this.loginForm.password
    }).subscribe({
      next: (response) => {
        this.isLoggingIn = false;
        console.log('Login successful:', response);
        
        // Extract and normalize role (remove brackets if present, e.g., "[founder]" -> "founder")
        const role = response.role ? response.role.replace(/[\[\]]/g, '').toLowerCase() : 'founder';
        
        // Store token and user info in localStorage
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('role', role);
        }
        
        // Reset form
        this.loginForm = {
          username: '',
          password: ''
        };
        
        // Redirect to dashboard with role query parameter
        this.router.navigate(['/dashboard'], { 
          queryParams: { role: role } 
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoggingIn = false;
        console.error('Login error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error error:', error.error);
        
        // Handle error response
        if (error.status === 401) {
          this.loginError = 'Invalid username or password. Please try again.';
        } else if (error.status === 403) {
          this.loginError = 'Access forbidden. Please check your credentials.';
        } else if (error.status === 0) {
          this.loginError = 'Cannot connect to the server. Please ensure the backend is running on http://localhost:8080';
        } else if (error.error && error.error.message) {
          this.loginError = error.error.message;
        } else if (error.status === 400) {
          this.loginError = 'Invalid form data. Please check your input.';
        } else {
          this.loginError = `Login failed (Status: ${error.status}). Please try again later.`;
        }
      }
    });
  }

}
