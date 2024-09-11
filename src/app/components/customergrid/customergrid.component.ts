import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../services/customer.service'; // Update path if necessary

@Component({
  selector: 'app-customergrid',
  templateUrl: './customergrid.component.html',
  styleUrls: ['./customergrid.component.css']
})
export class CustomergridComponent implements OnInit {
  customers: Customer[] = [];  // Array of customers
  editingCustomer: Customer | null = null;  // Customer currently being edited
  searchQuery: string = '';  // Query for searching customers
  error: string | null = null;  // To display any error messages

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  // Fetch all customers on component load
  getCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.error = 'Failed to load customers. Please try again later.';
      }
    });
  }

  // Add a new customer
  addCustomer(customer: Customer): void {
    this.customerService.addCustomer(customer).subscribe({
      next: (newCustomer: Customer) => {
        this.customers.push(newCustomer);  // Add customer to the grid
        this.editingCustomer = null;  // Exit edit mode
      },
      error: (err) => {
        console.error('Error adding customer:', err);
        this.error = 'Failed to add customer. Please try again later.';
      }
    });
  }

  // Search customers
  searchCustomers(): void {
    if (this.searchQuery.trim() !== '') {
      this.customerService.searchCustomers(this.searchQuery).subscribe({
        next: (results: Customer[]) => {
          this.customers = results;
        },
        error: (err) => {
          console.error('Error searching customers:', err);
          this.error = 'Failed to search customers. Please try again later.';
        }
      });
    } else {
      this.getCustomers(); // Reset to show all customers if search query is empty
    }
  }

  // Edit customer
  editCustomer(customer: Customer): void {
    this.customerService.editCustomer(customer).subscribe({
      next: (updatedCustomer: Customer) => {
        const index = this.customers.findIndex(c => c.autokey === updatedCustomer.autokey);
        if (index !== -1) {
          this.customers[index] = updatedCustomer;  // Update the customer in the grid
        }
        this.editingCustomer = null;  // Exit edit mode
      },
      error: (err) => {
        console.error('Error editing customer:', err);
        this.error = 'Failed to update customer. Please try again later.';
      }
    });
  }

  // Save changes (used when switching between Edit and Save modes)
  saveChanges(customer: Customer): void {
    if (this.editingCustomer) {
      // Call edit method if a customer is being edited
      this.editCustomer(customer);
    } else {
      // Enter edit mode for the customer
      this.editingCustomer = customer;
    }
  }
  
  // Delete customer
  deleteCustomer(autokey: number | undefined): void {
    if (autokey !== undefined) {  // Ensure autokey is defined
      this.customerService.deleteCustomer(autokey).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.autokey !== autokey);  // Remove customer from the grid
        },
        error: (err) => {
          console.error('Error deleting customer:', err);
          this.error = 'Failed to delete customer. Please try again later.';
        }
      });
    } else {
      console.error('Cannot delete customer without a valid autokey');
      this.error = 'Cannot delete customer without a valid autokey.';
    }
  }
}
