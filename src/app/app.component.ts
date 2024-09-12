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
  errorMessage: string = '';

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(customers => {
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
      return; // If form is invalid, don't add customer
    }
    this.customerService.addCustomer(this.newCustomer).subscribe(() => {
      this.loadCustomers();
      this.resetForm(); // Clear the form after submission
    });
  }

  validateForm(): boolean {
    let isValid = true;

    // Validate required fields
    if (!this.newCustomer.lastName || !this.newCustomer.firstName) {
      this.errorMessage = 'Last Name and First Name are required fields.';
      isValid = false;
    }

    // Validate address length
    if (this.newCustomer.address && (this.newCustomer.address.length < 10 || this.newCustomer.address.length > 50)) {
      this.errorMessage = 'Address must be between 10 and 50 characters.';
      isValid = false;
    }

    // Validate birthdate
    if (!this.newCustomer.birthdate || !this.isValidDate(new Date(this.newCustomer.birthdate))) {
      this.errorMessage = 'Birthdate is required and must be a valid date.';
      isValid = false;
    }

    // Check for duplicate name
    const duplicateCustomer = this.customers.find(
      (customer) =>
        customer.lastName === this.newCustomer.lastName &&
        customer.firstName === this.newCustomer.firstName &&
        customer.middleName === this.newCustomer.middleName
    );
    if (duplicateCustomer) {
      this.errorMessage = 'Duplicate name cannot be saved.';
      isValid = false;
    }

    return isValid;
  }

  isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  resetForm() {
    this.newCustomer = { lastName: '', firstName: '', middleName: '', address: '', birthdate: null }; // Reset form
    this.errorMessage = ''; // Clear error message
  }

  preFillForm(customer: Customer) {
    this.newCustomer = { ...customer }; // Creates a copy of the selected customer
  }

  editCustomer(customer: Customer) {
    this.customerService.editCustomer(customer).subscribe(() => {
      this.loadCustomers(); // Reload the list after edit
      this.resetForm(); // Reset the form after edit
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
