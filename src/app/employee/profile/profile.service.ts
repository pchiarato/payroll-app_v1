import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../auth/auth.service';
import 'rxjs/Rx';

@Injectable()
export class ProfileService implements OnInit {
  dateChanged = new Subject<any>();
  payroll:any[] = [];

    constructor(private http:Http, private authService:AuthService) {}

    ngOnInit() {

    }

    getPayrollByDate(date){
      const headers = new Headers({'Content-Type':'application/json'});
      headers.append('Authorization', this.authService.authToken);
      return this.http.get(`/users/payroll/${date}`, {headers:headers})
        .map((response:Response) => response.json())
        .catch((error:Response) => Observable.throw(error.json()))
        .subscribe(
          data => {
            this.setPayrollArray(data)
          },
          error => { 
            console.log(error)
          }
        )
       
    }
    setPayrollArray(array){
      this.payroll = array;
      this.dateChanged.next(this.payroll);
    }

    // method to get current payroll from current user.
      getPayroll() {
    const headers = new Headers({'Content-Type':'application/json'});
    headers.append('Authorization', this.authService.authToken);
    return this.http.get('/users/payroll',{headers:headers})
      .map( (data:Response) => data.json())
      .catch((error:Response) => Observable.throw(error.json()))
  }

}