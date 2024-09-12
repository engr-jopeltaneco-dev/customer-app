import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'customer-app';
  customers: Customer[] = [];
  newCustomer: Customer = { lastName: '', firstName: '', middleName: '', address: '', birthdate: null };
  errorMessage: string = ''; // Add an error message variable

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(customers => {
      console.log(customers);  // Log the customers to see what's being returned
      this.customers = customers;
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  searchQuery: string = '';

  searchCustomers() {
    this.customerService.searchCustomers(this.searchQuery).subscribe((data) => {
      this.customers = data;
    });
  }

  addCustomer() {
    this.errorMessage = ''; // Reset error message
    if (!this.validateForm()) {
      this.errorMessage = 'Form is invalid. Please check the fields.'; // Update error message
      return; // If form is invalid, don't add customer
    }
    this.customerService.addCustomer(this.newCustomer).subscribe(() => {
      this.loadCustomers();
      this.newCustomer = { lastName: '', firstName: '', middleName: '', address: '', birthdate: null };
    });
  }

  validateForm(): boolean {
    let isValid = true;
  
    // Validate required fields
    if (!this.newCustomer.lastName || !this.newCustomer.firstName || !this.newCustomer.middleName) {
      this.errorMessage = 'LastName, FirstName, and MiddleName are required fields.';
      isValid = false;
    }
  
    // Validate address length
    if (this.newCustomer.address && this.newCustomer.address.length > 50) {
      this.errorMessage = 'Address cannot exceed 50 characters.';
      isValid = false;
    }
  
    // Validate birthdate
    if (this.newCustomer.birthdate && !this.isValidDate(this.newCustomer.birthdate)) {
      this.errorMessage = 'Birthdate is not a valid date.';
      isValid = false;
    }
  
    // Check for duplicate name
    const duplicateCustomer = this.customers.find(customer => customer.lastName === this.newCustomer.lastName && customer.firstName === this.newCustomer.firstName && customer.middleName === this.newCustomer.middleName);
    if (duplicateCustomer) {
      this.errorMessage = 'Duplicate name cannot be saved.';
      isValid = false;
    }
  
    return isValid;
  }

  isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  preFillForm(customer: Customer) {
    this.newCustomer = { ...customer }; // Creates a copy of the selected customer
  }

  editCustomer(customer: Customer) {
    this.customerService.editCustomer(customer).subscribe(() => {
      this.loadCustomers(); // Reload the list after edit
      this.newCustomer = { lastName: '', firstName: '', middleName: '', address: '', birthdate: null }; // Reset the form
    });
  }

  deleteCustomer(autokey: number | undefined) {
    if (autokey !== undefined) {
      this.customerService.deleteCustomer(autokey).subscribe(() => {
        this.loadCustomers(); // Reload the list after delete
      });
    } else {
      console.error('Customer autokey is undefined!');
    }
  }
}