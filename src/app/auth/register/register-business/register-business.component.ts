import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NewBusiness } from './newBusiness.model';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register-business',
  templateUrl: './register-business.component.html',
  styleUrls: ['./register-business.component.sass']
})
export class RegisterBusinessComponent implements OnInit {

  constructor(private authService:AuthService, private flashMessages:FlashMessagesService, private router:Router) { }

  ngOnInit() {
  }

  registerBusiness(form:NgForm) {
    const business_owner:string = form.value.business_owner;
    const business_name:string = form.value.business_name;
    const business_type:string = form.value.business_type;
    const phone_number:string = form.value.phone_number;
    const email:string = form.value.email.toLowerCase();
    const address:string = form.value.address;
    const fax_number:string = form.value.fax_number;
    const pass:string = form.value.password;
    const newBusiness = new NewBusiness(business_owner,business_name,business_type,phone_number,email,address,pass,fax_number);
    console.log(newBusiness);
    this.authService.registerBusiness(newBusiness)
      .subscribe(
        (data => { 
          this.flashMessages.show('Business registered successfuly', {cssClass: 'alert-success', timeout: 2000})
          this.router.navigate(['/login']);
        }),
        (error => { this.flashMessages.show('Unable to register', {cssClass: 'alert-danger', timeout: 2000})})
      )
    form.resetForm();
  }

}
