import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Customer {
  autokey?: number;
  lastName: string;
  firstName: string;
  middleName: string;
  address: string;
  birthdate: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:5066/api/customers'; // Ensure this URL is correct

  constructor(private http: HttpClient) { }

  // Fetch all customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      map(response => {
        console.log('Response:', response); // Debugging
        return response;
      }),
      catchError(error => {
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        return of([]); // Return an empty array in case of error
      })
    );
  }
  
  // Add a new customer
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
      catchError(error => {
        console.error('Error adding customer:', error.message); // More specific error details
        return throwError(() => new Error('Error adding customer')); // Customize the error message
      })
    );
  }

  // Search customers
  searchCustomers(query: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?query=${query}`).pipe(
      catchError(error => {
        console.error('Error searching customers:', error.message); // More specific error details
        return of([]); // Return an empty array in case of error
      })
    );
  }

  // Edit a customer
  editCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customer.autokey}`, customer).pipe(
      catchError(error => {
        console.error('Error editing customer:', error.message); // More specific error details
        return throwError(() => new Error('Error editing customer')); // Customize the error message
      })
    );
  }

  // Delete a customer
  deleteCustomer(autokey: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${autokey}`).pipe(
      catchError(error => {
        console.error('Error deleting customer:', error.message); // More specific error details
        return throwError(() => new Error('Error deleting customer')); // Customize the error message
      })
    );
  }
}
