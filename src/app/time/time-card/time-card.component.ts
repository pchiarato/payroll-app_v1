import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';
import { TimeCardService } from './time-card.service';
import * as moment from 'moment';

@Component({
  selector: 'app-time-card',
  templateUrl: './time-card.component.html',
  styleUrls: ['./time-card.component.sass']
})
export class TimeCardComponent implements OnInit {
  timeId:number;
  user:{"id":0,"name":"","lastName":"","email":"","usertype":""};
  clockIn:string;
  clockOut:string;
  totalTime:string;
  isClockedIn:boolean = false;
  timeCardArray:any[] = [];
  subscription:Subscription;

  constructor(private authService: AuthService, private timeCardService:TimeCardService) { }
  

  // functions will run at pageload.
  ngOnInit() {
    // method to get user's profile.
    this.authService.getProfile()
      .subscribe(
        (profile) => {
          this.user = profile.user
        })
        //method to check anytime there is a change on the timetable.
    this.subscription = this.timeCardService.dateChanged
      .subscribe(
        (timeArray:any[]) => {
          this.timeCardArray = [];
          //console.log(this.timeCardArray)
          for (let prop of timeArray) {
                this.timeCardArray.push({clockin:moment(prop.clockin).format('YYYY-MM-DD HH:mm:ss'), clockout:moment(prop.clockout).format('YYYY-MM-DD HH:mm:ss')})
            }
        }
      )
        // method to get timecard.
        this.getTimeCard();

    
  }

// method to get timecard && to check if user is already clockedin and gets a reference to the timetable from sql. 
  getTimeCard() {
    this.timeCardService.getTimeCard()
      .subscribe(
        data => {
          if(data.length > 0) {
            this.timeCardArray = [];
            for (let prop of data) {
                this.timeCardArray.push({clockin:moment(prop.clockin).format('YYYY-MM-DD HH:mm:ss'), clockout:moment(prop.clockout).format('YYYY-MM-DD HH:mm:ss')})
            }
            let currentTime = this.timeCardArray[this.timeCardArray.length -1];
            if (currentTime.clockout === null || currentTime.clockout == 'Invalid date') {
              this.clockIn = currentTime.clockin;
              this.timeId = data[data.length -1].time_id;
              this.isClockedIn = true;
            }
          } else {
            //console.log('No data in timecard')
          }
        })

  }
// method to clock in.
  onClockin(){
    if (!this.isClockedIn) {
      this.clockIn = moment().utcOffset(-6).format('YYYY-MM-DD HH:mm:ss');
      console.log('clockin ',this.clockIn)
      this.isClockedIn = true;
      this.timeCardService.clockIn(this.clockIn)
        .subscribe(
          timecard => {
            if(timecard) {
                this.timeId = timecard.time_id;
                this.getTimeCard()
                //console.log(timecard)
            }else {
              console.log("Error from the onClockin function")
            }
          })
          error => { console.log(error)};
    }
  }
  //method to clockout.
    onClockout(){
        if (this.clockIn !== null && this.isClockedIn){
          //let time = moment().format('YYYY-MM-DD HH:mm:ss')
           this.clockOut = moment().utcOffset(-6).format('YYYY-MM-DD HH:mm:ss');
          //moment().format('YYYY-MM-DD HH:mm:ss');
          this.isClockedIn = false;
          this.timeCardService.clockOut(this.clockOut, this.timeId)
            .subscribe(
              timecard => {
                this.getTimeCard();
              }
            )
        }
    }
    //destroys subscription when exiting the page to avoid memory leak.
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
