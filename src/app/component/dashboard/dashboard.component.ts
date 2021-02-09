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
  currentRole = "GUEST";
  
  constructor(
    private appService: AppService,
    private router: Router,
  ) { }

  ngOnInit() {
   // this.getRoleInfo();
   this.getPermissionInfo();
  }
  getPermissionInfo(){
    // 
    let data = JSON.parse(localStorage.getItem('loginData'));
   
    this.appService.getAllPermission().subscribe((res: any) => {
      if(res.data && res.data.length > 0){
        let result= res.data.filter((itm)=>{
          return itm.ID == data.permission_id
        })
        if( result.length > 0){
          this.appService.USERS_PERMISSIONS = result[0].PERMISSION_ARRAY;
          console.log("permissions",this.appService.USERS_PERMISSIONS);
        }
      }
    });
  }
  getRoleInfo(){
    try{
     let data = JSON.parse(localStorage.getItem('loginData'));
     let params = {
       id:data.role_id_fk
     }
     this.appService.getRoleFromId(params).subscribe((res:any)=>{
        this.currentRole = res.data.ROLE_TYPE
        this.appService.CURRENT_ROLE = res.data.ROLE_TYPE;
        try{
          if( res.data.PERMISSION_ARRAY){
            const pa = JSON.parse(res.data.PERMISSION_ARRAY);
            if( pa.length > 0){
              this.appService.USERS_PERMISSIONS = pa;
            }
          }
        }catch(ex){}
       
     })
    }catch(e){}
   }
  navChange(val) {
    this.currentPage = val;
  }
  isAuthenticated() {
    return this.appService.isAuthenticated();
  }

}
