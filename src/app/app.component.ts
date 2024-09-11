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

  constructor(private customerService: CustomerService) { }

  ngOnInit() {this.customerService.getCustomers().subscribe(customers => {
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
    this.customerService.addCustomer(this.newCustomer).subscribe(() => {
      this.loadCustomers();
      this.newCustomer = { lastName: '', firstName: '', middleName: '', address: '', birthdate: null };
    });
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
