import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../services/customer.service'; // Update path if necessary

@Component({
  selector: 'app-customergrid',
  templateUrl: './customergrid.component.html',
  styleUrls: ['./customergrid.component.css']
})
export class CustomergridComponent implements OnInit {
  customers: Customer[] = [];  // Define the correct typing for customers array
  editingCustomer: Customer | null = null;  // To track if a customer is being edited
  searchQuery: string = '';  // For search functionality

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  // Fetch all customers on component load
  getCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  // Add a new customer
  addCustomer(customer: Customer): void {
    this.customerService.addCustomer(customer).subscribe(newCustomer => {
      this.customers.push(newCustomer);  // Add customer to the grid
    });
  }

  // Search customers
  searchCustomers(): void {
    if (this.searchQuery.trim() !== '') {
      this.customerService.searchCustomers(this.searchQuery).subscribe(results => {
        this.customers = results;
      });
    } else {
      this.getCustomers(); // Reset to show all customers if search query is empty
    }
  }

  // Edit customer
  editCustomer(customer: Customer): void {
    this.customerService.editCustomer(customer).subscribe(updatedCustomer => {
      const index = this.customers.findIndex(c => c.autokey === updatedCustomer.autokey);
      if (index !== -1) {
        this.customers[index] = updatedCustomer;  // Update the customer in the grid
      }
    });
  }

  // Save changes (used when switching between Edit and Save modes)
  saveChanges(customer: Customer): void {
    if (this.editingCustomer) {
      // Call edit method if a customer is being edited
      this.editCustomer(customer);
      this.editingCustomer = null;  // Exit edit mode
    } else {
      // Enter edit mode for the customer
      this.editingCustomer = customer;
    }
  }
  
deleteCustomer(autokey: number | undefined): void {
  if (autokey !== undefined) {  // Ensure autokey is defined
    this.customerService.deleteCustomer(autokey).subscribe(() => {
      this.customers = this.customers.filter(c => c.autokey !== autokey);  // Remove customer from the grid
    });
  } else {
    console.error('Cannot delete customer without a valid autokey');
  }
}
  
}
