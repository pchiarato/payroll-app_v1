import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx'
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class TimeCardService {
  dateChanged = new Subject<any[]>();
  times:any[] = [];

  constructor(private http:Http, private authService:AuthService) { }
  
getTimeCard() {
    let headers = new Headers({'Content-Type':'application/json'})
    headers.append('Authorization', this.authService.authToken);
    return this.http.get('/users/timecard', {headers: headers})
      .map((data: Response) => data.json())
      .catch((error: Response) => Observable.throw(error.json()))
  }

getTimeCardByDate(date) {
    let headers = new Headers({'Content-Type':'application/json'})
    headers.append('Authorization', this.authService.authToken);
    return this.http.get(`/users/timecard/${date}`, {headers: headers})
      .map((data: Response) => data.json())
      .catch((error: Response) => Observable.throw(error.json()))
      .subscribe(
        (times_response) => {
          this.setTimeArray(times_response);
        }
      )
  }
  setTimeArray(timeArray){
    this.times = timeArray;
    this.dateChanged.next(this.times);
  }

  clockIn(time:string) {
    let timeObj = {clockIn:time};
    let body = JSON.stringify(timeObj);
    let headers = new Headers({'Content-Type':'application/json'});
    headers.append('Authorization', this.authService.authToken);
    return this.http.post('/users/timecard', body ,{headers:headers})
      .map((data:Response) => data.json())
      .catch((error:Response) => Observable.throw(error.json()))
  }
  clockOut(time:string, time_id:number) {
    let timeObj = {clockOut:time, timeCardId:time_id}
    let body = JSON.stringify(timeObj);
    let headers = new Headers({'Content-Type':'application/json'});
    headers.append('Authorization', this.authService.authToken);
    return this.http.post('/users/timecard', body, {headers:headers})
      .map((data:Response) => data.json())
      .catch((error:Response) => Observable.throw(error.json()));
  }

}
