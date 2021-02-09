import { Component, Input, OnInit, ViewChild,EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/service/app.service';
import { RoleDialogueComponent } from '../role-dialogue/role-dialogue.component';

@Component({
  selector: 'app-permission-dashboard-list',
  templateUrl: './permission-dashboard-list.component.html',
  styleUrls: ['./permission-dashboard-list.component.css']
})
export class PermissionDashboardListComponent implements OnInit {

  @Input()
  roles = [];
  @Input()
  permissions = [];
  @Output()
  changedPermissionData = new EventEmitter<any>();

  delPerId = 0;
  constructor(
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(){
  }
  join(arr){
    try{
      if(arr){
        const array = JSON.parse(arr);
        return array.join();
      }else{
        return "-";
      }
    }catch(e){}
    
  }
  editUser(role){
    const dialogRef = this.dialog.open(RoleDialogueComponent, {
      width: '60%',
      height: '88%',
      disableClose: true,
      data :{
        roles : this.roles,
        permissions:this.permissions,
        type:"edit",
        formData :role
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.changedPermissionData.emit('changed');
      console.log('The dialog was closed');
    });
  }
  roleAccess(from){
    if(this.appService.USERS_PERMISSIONS.indexOf(from) !== -1){
      return "hasAccess";
    }else{
      return "noAccess";
    }
  }
  deletePermission() {
    let params = {
      id: this.delPerId
    }
    this.appService.deletePermission(params).subscribe((res: any) => {
          this.changedPermissionData.emit('changed');
    });
  }
  setdelPermissionId(id) {
    this.delPerId = id;
  }
}
