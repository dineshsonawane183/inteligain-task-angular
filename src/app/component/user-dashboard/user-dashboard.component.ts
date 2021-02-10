import { Component, OnInit, Output, ViewChild,EventEmitter  } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/service/app.service';
import { EditUserDialogueComponent } from '../edit-user-dialogue/edit-user-dialogue.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  sectionTitle: string = "User Dashboard";
  users = [];
  permissions =[];
  usrIdForDel = 0;
  @Output()
  userDetailsChanged  = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(){
    this.getAllUsers();
    this.getAllPermissions();
  }
  getAllUsers() {
    this.appService.getAllUsers().subscribe((res: any) => {
      this.users = res.data;
      console.log(this.users)
    });
  }
  getAllPermissions() {
    this.appService.getAllPermission().subscribe((res: any) => {
      this.permissions = res.data;
    });
  }
  getPermissionCode(code){
    let retval :any= this.permissions.filter((item)=>{
      return item.ID == code.permission_id
    });
    if(retval && retval.length > 0){
      return retval[0].PERMISSION_CODE;
    }else{
      return code;
    }
  }
  editUser(usr){
    const dialogRef = this.dialog.open(EditUserDialogueComponent, {
      width: '60%',
      height: '88%',
      disableClose: true,
      data:usr
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllUsers();
      this.userDetailsChanged.emit();
      console.log('The dialog was closed');
    });
  }
  role(from){
    if(this.appService.USERS_PERMISSIONS.indexOf(from) !== -1){
      return "hasAccess";
    }else{
      return "noAccess";
    }
  }
  setUsrIdForDel(id){
    this.usrIdForDel = id;
  }
  deleteUser(){
    let params = {
      id: this.usrIdForDel
    }
    this.appService.deleteUser(params).subscribe((res: any) => {
        if(res.status === 'success'){
          this.getAllUsers();
        }
    });
  }
}
