import { Component, Input, OnInit, ViewChild,EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/service/app.service';
import { EditUserDialogueComponent } from '../edit-user-dialogue/edit-user-dialogue.component';
import { RoleDialogueComponent } from '../role-dialogue/role-dialogue.component';

@Component({
  selector: 'app-role-dashboard',
  templateUrl: './role-dashboard.component.html',
  styleUrls: ['./role-dashboard.component.css']
})
export class RoleDashboardComponent implements OnInit {

  @Input()
  roles = [];
  @Input()
  permissions = [];
  @Output()
  changedRoleData = new EventEmitter<any>();

  delRoleId = 0;
  constructor(
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(){
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
      this.changedRoleData.emit('changed');
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
  deleteRole() {
    let params = {
      id: this.delRoleId
    }
    this.appService.deleteRole(params).subscribe((res: any) => {
          this.changedRoleData.emit('changed');
    });
  }
  setdelRoleId(id) {
    this.delRoleId = id;
  }
}
