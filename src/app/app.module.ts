import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomergridComponent } from './components/customergrid/customergrid.component'; // Correct import path
import { CustomerService } from './services/customer.service';  // Import CustomerService

@NgModule({
  declarations: [
    AppComponent,
    CustomergridComponent  // Declare the new component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CustomerService,provideHttpClient(withFetch())],  // Add CustomerService to providers
  bootstrap: [AppComponent]
})
export class AppModule { }
