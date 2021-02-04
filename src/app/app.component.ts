import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private appService :AppService,
    private router:Router
  ){}

  isAuthenticated() {
    return this.appService.isAuthenticated();
  }
  logout() {
    this.appService.logout();
    this.router.navigate(['login']);
  }
}
