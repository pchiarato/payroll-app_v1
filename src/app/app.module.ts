import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { RoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { RegisterComponent } from './auth/register/register.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeService } from './employee/employee.service';
import { TimeCardComponent } from './time/time-card/time-card.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ProfileComponent } from './employee/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { TimeCardService } from './time/time-card/time-card.service';
import { ProfileService} from './employee/profile/profile.service';
import { DatepickerModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap'
import { ChartsModule } from 'ng2-charts';
import { EmployeeDetailComponent } from './employee-list/employee-detail/employee-detail.component';
import { EmployeeDetailModalComponent } from './employee-list/employee-detail/employee-detail-modal/employee-detail-modal.component';
import { RegisterBusinessComponent } from './auth/register/register-business/register-business.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    EmployeeListComponent,
    TimeCardComponent,
    ProfileComponent,
    EmployeeDetailComponent,
    EmployeeDetailModalComponent,
    RegisterBusinessComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    FlashMessagesModule,
    ChartsModule,
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [AuthService, EmployeeService, AuthGuard, TimeCardService, ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
