import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    DEFAULT_ROLE = 2;
    constructor(
        private http: HttpClient,
        public jwtHelper: JwtHelperService
    ) { }

    public logout() {
        localStorage.removeItem('token');
        const body = { message: "user logged out" };
        return body;
    }
    public isAuthenticated(): boolean {
        const token: any = localStorage.getItem('token');
        return !this.jwtHelper.isTokenExpired(token);
    }
    saveEmployee(params = {}) {
        return this.http.post(environment.api_url + "api/employee", params)
    }
    updateEmployee(params = {}) {
        return this.http.patch(environment.api_url + "api/employee", params)
    }
    deleteEmployee(params = {}) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: params,
        };
        return this.http.delete(environment.api_url + "api/employee/delete", options)
    }
    getAllEmployees(params = {}) {
        return this.http.get(environment.api_url + "api/employee", params)
    }
    getUsers(params = {}) {
        return this.http.get(environment.api_url + "api/user", params);
    }
    login(params = {}) {
        return this.http.post(environment.api_url + "login", params)
    }
    register(params = {}) {
        return this.http.post(environment.api_url + "register", params)
    }
}