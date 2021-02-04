import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { CreateEmployeeDialogueComponent } from '../create-employee-dialogue/create-employee-dialogue.component';
import { ViewEmployeeDialogueComponent } from '../view-emp-dialogue/view-emp-dialogue.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentPage = 'emp';
  constructor(
    private appService: AppService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  navChange(val) {
    this.currentPage = val;
  }
  isAuthenticated() {
    return this.appService.isAuthenticated();
  }

}
