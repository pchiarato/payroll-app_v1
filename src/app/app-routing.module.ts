import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RegisterBusinessComponent } from './auth/register/register-business/register-business.component';
import { TimeCardComponent } from './time/time-card/time-card.component';
import { ProfileComponent } from './employee/profile/profile.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-list/employee-detail/employee-detail.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: '', redirectTo:'/home', pathMatch:'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, canActivate:[AuthGuard] },
    { path: 'register-business', component: RegisterBusinessComponent},
    { path: 'timecard', component: TimeCardComponent, canActivate:[AuthGuard]},
    { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
    { path: 'employees', component: EmployeeListComponent, canActivate:[AuthGuard], children:[
        {path: 'details', component: EmployeeDetailComponent}
    ] }

    
]


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
        ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {

}