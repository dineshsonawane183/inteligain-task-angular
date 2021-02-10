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
    CURRENT_ROLE = "";
    USERS_PERMISSIONS = [];
    loggedInData = {};
    constructor(
        private http: HttpClient,
        public jwtHelper: JwtHelperService
    ) { }
    public getToken(): string {
        return localStorage.getItem('token');
      }
    public logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('loginData');
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
    updateUserDetails(params = {}) {
        return this.http.patch(environment.api_url + "api/user", params)
    }
    getAllRoles(params = {}){
        return this.http.get(environment.api_url + "api/role", params);
    }
    getRoleFromId(params){
        return this.http.get(environment.api_url + "api/role/id?id="+params.id);
    }
    getAllPermission(params = {}){
        return this.http.get(environment.api_url + "api/role/permission", params);
    }
    createRole(params = {}){
        return this.http.post(environment.api_url + "api/role", params)     
    }
    updateRole(params = {}) {
        return this.http.patch(environment.api_url + "api/role", params)
    }
    createPermission(params = {}){
        return this.http.post(environment.api_url + "api/role/permission", params)
    }
    editPermission(params = {}){
        return this.http.patch(environment.api_url + "api/role/permission", params)
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
    deletePermission(params = {}) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: params,
        };
        return this.http.delete(environment.api_url + "api/role/permission/delete", options)
    }
    deleteRole(params = {}) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: params,
        };
        return this.http.delete(environment.api_url + "api/role/delete", options)
    }
    deleteUser(params = {}){
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: params,
        };
        return this.http.delete(environment.api_url + "api/user/delete", options)
    }
    getAllEmployees(params = {}) {
        return this.http.get(environment.api_url + "api/employee", params)
    }
    getAllUsers(params = {}) {
        return this.http.get(environment.api_url + "api/user", params);
    }
    login(params = {}) {
        return this.http.post(environment.api_url + "login", params)
    }
    register(params = {}) {
        return this.http.post(environment.api_url + "register", params)
    }
}