import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { CreateEmployeeDialogueComponent } from '../create-employee-dialogue/create-employee-dialogue.component';
import { ViewEmployeeDialogueComponent } from '../view-emp-dialogue/view-emp-dialogue.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  loginInvalid: boolean = false;
  sectionTitle: string = "Employee Management";
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
  role(from){
    if(this.appService.USERS_PERMISSIONS.indexOf(from) !== -1){
      return "hasAccess";
    }else{
      return "noAccess";
    }
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
