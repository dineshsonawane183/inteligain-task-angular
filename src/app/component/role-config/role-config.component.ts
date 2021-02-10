import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PermissionDashboardComponent } from '../permission-dashboard/permission-dashboard.component';
import { RoleDialogueComponent } from '../role-dialogue/role-dialogue.component';

@Component({
  selector: 'app-role-config',
  templateUrl: './role-config.component.html',
  styleUrls: ['./role-config.component.css']
})
export class AdminDashboardComponent implements OnInit {

  sectionTitle: string = "Admin Configuration";
  roles = [];
  dataSource;
  permissions = [];
  currentSection = "role";
  constructor(
    public dialog: MatDialog,
    private appService: AppService,
    private fb: FormBuilder,
    private toastr: NotificationService,
  ) { }

  treeControl = new NestedTreeControl<RoleNode>(node => node.children);

  hasChild = (_: number, node: RoleNode) => !!node.children && node.children.length > 0;

  
  permissionForm: FormGroup = this.fb.group({
    permission_code: ["", Validators.required],
    permission_desc: ["", Validators.required],
  });


  ngOnInit() {
    this.getAllRoles();
    this.getAllPermissions();
  }
  getAllRoles() {
    this.appService.getAllRoles().subscribe((res: any) => {
      this.roles = res.data;
      let roleArr = this.roles.map((itm) => {
        return { ID: itm.ID, ROLE_TYPE: itm.ROLE_TYPE, parent: itm.parent }
      })
      this.buildHierarchy(roleArr);
    });
  }


  buildHierarchy(arry) {

    var roots = [], children = {};

    for (var i = 0, len = arry.length; i < len; ++i) {
      var item = arry[i],
        p = item.parent,
        target = p == 0 ? roots : (children[p] || (children[p] = []));
      target.push({ value: item });
    }

    var findChildren = function (parent) {
      if (children[parent.value.ID]) {
        parent.children = children[parent.value.ID];
        for (var i = 0, len = parent.children.length; i < len; ++i) {
          findChildren(parent.children[i]);
        }
      }
    };

    for (var i = 0, len: any = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }
    this.dataSource = roots;
    console.log(roots);
  }


  changedRoleData(){
    this.getAllRoles();
    this.getAllPermissions();
  }
  getAllPermissions() {
    this.appService.getAllPermission().subscribe((res: any) => {
      this.permissions = res.data;
    });
  }
  
  radioChange(val) {
    this.currentSection = val;
  }
  
  createPermissionClicked(){
    const dialogRef = this.dialog.open(PermissionDashboardComponent, {
      width: '60%',
      height: '88%',
      disableClose: true,
      data :{
        type:"create"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      this.getAllPermissions();
    });
  }
  role(from){
    if(this.appService.USERS_PERMISSIONS.indexOf(from) !== -1){
      return "hasAccess";
    }else{
      return "noAccess";
    }
  }
  createRolelicked(){
    const dialogRef = this.dialog.open(RoleDialogueComponent, {
      width: '60%',
      height: '88%',
      disableClose: true,
      data :{
        roles : this.roles,
        permissions:this.permissions,
        type:"create"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      this.changedRoleData();
    });
  }

}
interface RoleNode {
  value: object;
  children?: RoleNode[];
}