import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MatTreeNestedDataSource } from '@angular/material';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';

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
    private toastr: NotificationService
  ) { }

  treeControl = new NestedTreeControl<RoleNode>(node => node.children);

  hasChild = (_: number, node: RoleNode) => !!node.children && node.children.length > 0;

  roleForm: FormGroup = this.fb.group({
    role_type: ["", Validators.required],
    role_description: ["", Validators.required],
    parent: ["", Validators.required],
    permission: ["", Validators.required],
  });
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



  getAllPermissions() {
    this.appService.getAllPermission().subscribe((res: any) => {
      this.permissions = res.data;
    });
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.roleForm.valid) {
      this.appService.createRole(this.roleForm.value).subscribe((res: any) => {
        this.roleForm.reset();
        formDirective.resetForm();
        this.toastr.showSuccess("Role saved successfully", "Success")
        this.getAllRoles();
        this.getAllPermissions();
      });
    }
  }
  radioChange(val) {
    this.currentSection = val;
  }
  onPermissionSubmit(formDirective: FormGroupDirective) {
    if (this.permissionForm.valid) {
      this.appService.createPermission(this.permissionForm.value).subscribe((res: any) => {
        this.permissionForm.reset();
        formDirective.resetForm();
        this.toastr.showSuccess("Permission saved successfully", "Success")
        this.getAllRoles();
        this.getAllPermissions();
      });
    }
  }
 
}
interface RoleNode {
  value: object;
  children?: RoleNode[];
}