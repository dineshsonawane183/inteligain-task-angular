import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public app: AppService, public router: Router) {}
  canActivate(): boolean {
    if (!this.app.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}