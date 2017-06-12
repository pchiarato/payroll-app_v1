import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewEmployee } from '../../employee/new-employee.model';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private flashMessages: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegister(form: NgForm) {
    const fname:string = form.value.fname;
    const lname:string = form.value.lname;
    const email:string = form.value.email.toLowerCase();
    const pass:string = form.value.pass;
    // addon
    const phonenumber:string = form.value.phonenumber;
    const gender:string = form.value.gender;
    const address:string = form.value.address;
    const rate:number = form.value.rate;
    const dob:string = form.value.dob;
    const hire_date:string = form.value.hire_date;
    const department:string = form.value.department;
    // end of addon
    const usertype:string = form.value.usertype;
    const employee: NewEmployee = new NewEmployee(fname, lname, email, pass, usertype, phonenumber, gender, address, rate, department, dob, hire_date);
    this.authService.registerUser(employee)
    .subscribe(
        data => { this.flashMessages.show('User registered successfuly', {cssClass: 'alert-success', timeout: 3000}) },
        error => { console.log(error), this.flashMessages.show("There was an error while registering the user", {cssClass: 'alert-danger', timeout: 2000}) }
    );

      
    form.resetForm();

  }

}


// public fname:string,
// public lname:string,
// public email:string,
// public pass:string,
// public usertype:string,
// public phonenumber:string,
// public gender:string,
// public address:string,
// public rate:string,
// public department:string,
// public dob:string,
// public hiredate:string