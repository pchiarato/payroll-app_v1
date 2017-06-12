import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../employee/profile/profile.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { TimeCardService } from '../time/time-card/time-card.service';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  user:{id:number,name:string,lastName:string,email:string,usertype:string} = {"id":0,"name":"","lastName":"","email":"","usertype":""};
  isAdmin:boolean = true;
  showDate:boolean = false;
  //@Output() dateChanged = new EventEmitter<any>();

  constructor(private authService: AuthService, private router: Router, private flashMessages: FlashMessagesService, private timeService: TimeCardService, private profileService:ProfileService) { }

  ngOnInit() {
    this.authService.getProfile()
      .subscribe(
        data => {
          this.user = data
          this.adminCheck(data.usertype);
        }
        
      )
      
  }
  
  onLogout() {
    this.authService.logout();
    this.flashMessages.show("Successfuly Logged out!", {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['login']);
    this.isAdmin = false;

  }
  
  activeDateChange(event) {
    // console.log(event);
    this.timeService.getTimeCardByDate(moment(event).format('YYYY-MM-DD'));
    this.profileService.getPayrollByDate(moment(event).format('YYYY-MM-DD'));
      // .subscribe(
      //   (time) => {console.log(time)},
      //   (error) => {console.log('error from header', error)}
      // )
    //this.dateChanged.emit(event);
  }
  adminCheck(usertype):boolean {
      if (usertype != 'admin'|| usertype != 'owner'){
      return this.isAdmin = false;
    }
    return this.isAdmin = true;
    
    
  }

}
