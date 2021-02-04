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
  employees = [];
  empIdForDel = 0;
  constructor(
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(){
    this.getAllEmployees();
  }
  getAllEmployees() {
    this.appService.getAllEmployees().subscribe((res: any) => {
      this.employees = res.data;
    });
  }
  deleteEmployee() {
    let params = {
      id: this.empIdForDel
    }
    this.appService.deleteEmployee(params).subscribe((res: any) => {
        if(res.status === 'success'){
          this.getAllEmployees();
        }
    });
  }
  setEmpIdForDel(id) {
    this.empIdForDel = id;
  }
  viewEmployee(emp){
    const dialogRef = this.dialog.open(ViewEmployeeDialogueComponent, {
      width: '60%',
      height: '88%',
      data:emp
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllEmployees();
      console.log('The dialog was closed');
    });
  }
  employeeAction(action,data = {}) {
    data = {...data,action:action}
    const dialogRef = this.dialog.open(CreateEmployeeDialogueComponent, {
      width: '60%',
      height: '88%',
      disableClose: true,
      data:data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllEmployees();
      console.log('The dialog was closed');
    });
  }
  

}
