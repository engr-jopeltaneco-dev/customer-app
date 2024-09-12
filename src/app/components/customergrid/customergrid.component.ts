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
  savingCustomer: Customer | null = null;  // Customer being saved
  searchQuery: string = '';  // Query for searching customers
  error: string | null = null;  // To display any error messages
  errorMessage: string | null = null;  // To display error messages for duplicate names

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
      this.getCustomers();
    }
  }

  // Toggle between Edit and Save mode
  toggleEdit(customer: Customer): void {
    if (customer) {
      if (this.editingCustomer === customer) {
        // Save the changes
        this.savingCustomer = customer;
        if (this.validateCustomer(customer)) {
          if (this.checkDuplicateName(customer)) {
            alert('Duplicate name cannot be saved.');
            return;
          }
          this.customerService.editCustomer(customer).subscribe({
            next: (updatedCustomer: Customer) => {
              const index = this.customers.findIndex(c => c.autokey === updatedCustomer.autokey);
              if (index !== -1) {
                this.customers[index] = updatedCustomer; // Update customer data
              }
            },
            error: (err) => {
              console.error('Error updating customer:', err);
              this.error = 'Failed to update customer. Please try again later.';
            },
            complete: () => {
              this.savingCustomer = null;
              this.editingCustomer = null; // Reset editingCustomer to null after save operation
            }
          });
        } else {
          alert('Please fill in all required fields and ensure the birthdate is valid.');
        }
      } else {
        // Enter edit mode
        this.editingCustomer = customer;
      }
    }
  }

  // Delete customer
  deleteCustomer(autokey: number | undefined): void {
    if (autokey !== undefined) {
      this.customerService.deleteCustomer(autokey).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.autokey !== autokey); // Remove customer from grid
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

  // Check for duplicate name
  checkDuplicateName(customer: Customer): boolean {
    const duplicateCustomer = this.customers.find(c => c.autokey !== customer.autokey && c.lastName === customer.lastName && c.firstName === customer.firstName && c.middleName === customer.middleName);
    if (duplicateCustomer) {
      alert('Duplicate name cannot be saved.');
      return true;
    }
    return false;
  }

  validateCustomer(customer: Customer): boolean {
    if (!customer.lastName || !customer.firstName || !customer.middleName || !customer.address || !customer.birthdate) {
      return false;
    }
    return true;
  }
}