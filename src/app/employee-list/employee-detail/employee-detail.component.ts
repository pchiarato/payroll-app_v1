import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router'
import { EmployeeService } from '../../employee/employee.service';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.sass']
})
export class EmployeeDetailComponent implements OnInit {
  subscription:Subscription;
  id:number;
  employee:{};

  constructor(private employeeService:EmployeeService, private route:ActivatedRoute) { }

  ngOnInit() {

     this.subscription = this.employeeService.employeeChanged
      .subscribe(
        data => this.employee = data,
        error => { console.log(error)}
      )
    this.route.params
      .subscribe(
        (params:Params) => {
          this.id = +params['id']
        }
      )
   
  }
  dateFormater(date:any){
    return moment(date).format('YYYY/MM/DD');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
