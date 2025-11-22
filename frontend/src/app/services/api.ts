import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = `${environment.apiUrl}` // ✅ base backend URL

  constructor(private http: HttpClient) {}

  // 🌐 GET request
  get(endpoint: string, params?: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: params || {} });
    return this.http.get(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  // 📨 POST request
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  // ✏️ PUT request
  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  }

  // ❌ DELETE request
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`);
  }
}
