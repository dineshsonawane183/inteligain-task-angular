import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { CreateEmployeeDialogueComponent } from '../create-employee-dialogue/create-employee-dialogue.component';
import { ViewEmployeeDialogueComponent } from '../view-emp-dialogue/view-emp-dialogue.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  sectionTitle: string = "User Management";
  users = [];
  empIdForDel = 0;
  constructor(
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(){
    this.getAllUsers();
  }
  getAllUsers() {
    this.appService.getAllUsers().subscribe((res: any) => {
      this.users = res.data;
      console.log(this.users)
    });
  }
  
  

}
