import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  isAuthenticated() {
    return this.appService.isAuthenticated();
  }
  getLoggedInData(){
    return this.appService.loggedInData;
  }
  logout() {
    this.appService.logout();
    this.router.navigate(['login']);
  }
}
