import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from './profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  userInfo:{};
  user:{};
  week_ending:string;
  percentagesArray:number[];
  test:any[] = [];
  subscription:Subscription;
  
 
  
 

  
  //doughnut
  public doughnutChartLabels:string[] = ['Employee Pay', 'FICA Federal Taxes', 'FICA Medicare', 'Social Security'];
  //public doughnutChartData:number[] = [0.60, 0.30, 0.10]; //this will need to be changed to dynamic data
  //public doughnutChartData:number[] = [79.35, 15.9, 1.51, 4.2]; //this will need to be changed to dynamic data
  public doughnutChartData:number[]=[]; //this will need to be changed to dynamic data
  
  public doughnutChartType:string = 'doughnut';
  public doughnutChartColors:{}[] = [{ 
        backgroundColor:["#0E8BCC", "#28627F", "#82D5FF", "#12AEFF", "#09577F"] 
      }]


  constructor(private router: Router, private authService: AuthService, private profileService:ProfileService) { }

  ngOnInit() {
    this.authService.getProfile()
      .subscribe(
        data => { 
          this.user = data;
          //console.log('this.user from getProfile(),', this.user);
        },
        error => { console.log('error from getProfile profile.component.ts', error)}
      )
      this.profileService.dateChanged
        .subscribe(
          olderPayroll => { 
            this.userInfo = {}
            this.test = olderPayroll;
            this.userInfo = this.test[0];
            if (olderPayroll.length > 0){
          this.userInfo = olderPayroll[0]
          this.week_ending = moment(olderPayroll[0].week_ending).format('YYYY-MM-DD');
          this.doughnutChartData = [];
          this.percentagesArray = this.calculatePercentages(
            olderPayroll[0].gross_pay,
            olderPayroll[0].federal_tax_amount,
            olderPayroll[0].medicare_amount,
            olderPayroll[0].social_security_amount
            )
            this.doughnutChartData = this.percentagesArray;
            
            }
          },
          error => { 
            console.log('error from profile.component.ts', error)
          }
        )
    this.profileService.getPayroll()
      .subscribe(
        payroll => {
          if (payroll.length > 0){
          this.userInfo = payroll[0]
          this.week_ending = moment(payroll[0].week_ending).format('YYYY-MM-DD');
          //console.log(payroll[0])
          this.percentagesArray = this.calculatePercentages(
            payroll[0].gross_pay,
            payroll[0].federal_tax_amount,
            payroll[0].medicare_amount,
            payroll[0].social_security_amount
            )
            
            this.doughnutChartData = this.percentagesArray;
          //console.log(this.percentages);
          }
        },
        (error) => { console.log('error from profile.component', error)}
      )

  }


currencyFormater(amount:string):string {
  return '$'+amount.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

calculatePercentages(gross_pay,federal_tax,medicare_tax,social_tax):number[]{
  let arr:any[]=[];
  let social:number = social_tax / gross_pay;
  let medicare:number = medicare_tax / (gross_pay - social_tax);
  let federal:number = federal_tax / (gross_pay - social_tax - medicare_tax);
  let total_deductions:number = (+federal_tax + (+medicare_tax) + (+social_tax));
  let net_pay:number = ((gross_pay - total_deductions) / gross_pay);
  arr.push(net_pay,federal,medicare,social)
  return arr.map(nums => +(nums * 100).toFixed(2));

}


ngOnDestroy(){
  //this.subscription.unsubscribe();
}
// let social_percentage = (64.48 / 1535.25) // socialsecurity / gross;
// let medicare_percentage = (22.26 / (1535.25 - 64.48)) // (medicare / (gross - socialsecurity));
// let federal_percentage = (230.29/ (1535.25 - 64.48 - 22.26)) // federal / ((gross - social - medicare));
// let deductions = (64.48 + 22.26 + 230.29); //total deductions
// let net_percentage = ((1535.25 - deductions) / 1535.25)  //((gross - deductions) / gross)


}
