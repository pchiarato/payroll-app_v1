import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../auth/auth.service';
import 'rxjs/Rx';

@Injectable()
export class EmployeeService {
employeeChanged = new Subject<any>();
employees:any[];

  constructor(private http: Http, private authService:AuthService) { }

// method to get all employees if usertype === admin
  getEmployees() {
    let headers = new Headers({'Content-Type':'application/json'})
    headers.append('Authorization',this.authService.authToken)
    return this.http.get('/users/listusers', {headers:headers})
      .map((data: Response) => data.json() )
      .catch((error: Response) => Observable.throw(error.json()))

  }

  // end point for employee-details
// method that gets employee by id and shows on their details
  getEmployeeById(id:number) {
    let headers = new Headers({'Content-Type':'application/json'})
    headers.append('Authorization', this.authService.authToken)
    let queryId = id;
    return this.http.get('/users/employee/'+queryId, {headers: headers})
      .map((data:Response) => data.json())
      .catch((error:Response) => Observable.throw(error.json()))
      .subscribe(
        (employee) => {
           this.setEmployeeArray(employee)
           //console.log(this.employees);
          },
        (err) => { console.log('err', err)}
      )
  }

  setEmployeeArray(array) {
    this.employees = array
    this.employeeChanged.next(this.employees);
  }




}
