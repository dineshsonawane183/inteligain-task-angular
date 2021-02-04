import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { CreateEmployeeDialogueComponent } from '../create-task-dialogue/create-employee-dialogue.component';

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
  logout() {
    this.appService.logout();
    this.router.navigate(['login']);
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
  createEmployee() {
    const dialogRef = this.dialog.open(CreateEmployeeDialogueComponent, {
      width: '60%',
      height: '88%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllEmployees();
      console.log('The dialog was closed');
    });
  }
}
