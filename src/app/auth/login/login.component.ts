import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;

  constructor(private authService:AuthService, private flashMessages:FlashMessagesService, private router:Router) { }

  ngOnInit() {
  }
  onLogin(form: NgForm) {
    this.email = form.value.email.toLowerCase();
    this.password = form.value.password;
    const user = {email:this.email,pass:this.password}
    this.authService.loginUser(user)
      .subscribe(
        data => {
           //console.log('onLogin from loginComponent ',data.user)
           if (data.success) {
           this.authService.storeUserData(data.token, data.user); 
           this.flashMessages.show("Successfuly logged in!",{ cssClass: 'alert-success', timeout: 3000});
           this.router.navigate(['/profile']);

              } else {
                  this.flashMessages.show('The Email/Password is incorrect', { cssClass: 'alert-danger', timeout: 3000});
                  this.router.navigate(['/login']);
               }
               form.resetForm();
              });
        }
  }
  // onLogin(form: NgForm) {
  //   this.email = form.value.email.toLowerCase();
  //   this.password = form.value.password;
  //   const user = {email:this.email,pass:this.password}
  //   this.authService.loginUser(user)
  //     .subscribe(
  //       data => {
  //          console.log(data)
  //          this.authService.storeUserData(data.token, data.user); 
  //          this.flashMessages.show("Successfuly logged in!",{ cssClass: 'alert-success', timeout: 3000});
  //          this.router.navigate(['/users/profile']);
  //         },
  //       error => {this.flashMessages.show('The Email/Password is incorrect', { cssClass: 'alert-danger', timeout: 3000}) });
  //       this.router.navigate(['/users/login']);
  //    form.resetForm();
  // }



