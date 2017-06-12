import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs';
import { NewEmployee } from '../employee/new-employee.model';
import { NewBusiness } from '../auth/register/register-business/newBusiness.model';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthService {
    authToken: any;
    user :any

    constructor(private http: Http) {}

    registerBusiness(business: NewBusiness) {
        const body = JSON.stringify(business);
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post('/users/register-business', body, {headers:headers})
            .map((response:Response) => response.json())
            .catch((error:Response) => Observable.throw(error.json()))
    }

    registerUser(user: NewEmployee) {
        const body = JSON.stringify(user)
        const headers = new Headers({'Content-Type': 'application/json'})
        headers.append('Authorization',this.authToken)
        // this returns an Observable to be subscribed by the component that uses it.
        return this.http.post('/users/register', body, {headers: headers}) 
            .map((response: Response) => response)
            .catch((error: Response) => Observable.throw(error.json()))
    }
    loginUser(user) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type':'application/json'})
        return this.http.post('/users/login', body, {headers: headers})
            .map((response:Response) => response.json())
            .catch((error:Response) => Observable.throw(error.json))

    }
    storeUserData(token, user) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
        this.authToken = token;
    }

    getProfile() {
        const headers = new Headers
        this.loadToken()
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.get('/users/profile', {headers: headers})
            .map((response:Response) => response.json())
            .catch((error:Response) => Observable.throw(error.json()))

        
    }
    loadToken() {
        let token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    loggedIn() {
        return tokenNotExpired('id_token');
    }

    logout() {
        this.user = null
        this.authToken = null
        localStorage.clear()
    }

} 