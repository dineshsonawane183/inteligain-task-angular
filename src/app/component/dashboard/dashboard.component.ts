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

  sectionTitle: string = "Employee Management";
  employees = [];
  empIdForDel = 0;
  constructor(
    private appService: AppService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllEmployees();
  }
  isAuthenticated() {
    return this.appService.isAuthenticated();
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
