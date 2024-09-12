import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomergridComponent } from './components/customergrid/customergrid.component'; 
import { CustomerService } from './services/customer.service'; 

@NgModule({
  declarations: [
    AppComponent,
    CustomergridComponent  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CustomerService, provideHttpClient(withFetch())],
  bootstrap: [AppComponent]
})
export class AppModule { }
