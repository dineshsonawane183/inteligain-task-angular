import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
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
  permissions = [];
  currentSection = "role";
  constructor(
    public dialog: MatDialog,
    private appService: AppService,
    private fb: FormBuilder,
    private toastr : NotificationService
  ) { }


  roleForm: FormGroup = this.fb.group({
    role_type: ["", Validators.required],
    role_description: ["", Validators.required],
    parent: ["", Validators.required],
    permission: ["", Validators.required],
  });
  permissionForm : FormGroup = this.fb.group({
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
      console.log(this.roles)
    });
  }
  getAllPermissions() {
    this.appService.getAllPermission().subscribe((res: any) => {
      this.permissions = res.data;
      console.log(this.permissions)
    });
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.roleForm.valid) {
      this.appService.createRole(this.roleForm.value).subscribe((res: any) => {
        this.roleForm.reset();
        formDirective.resetForm();
        this.toastr.showSuccess("Role saved successfully","Success")
        this.getAllRoles();
        this.getAllPermissions();
      });
    }
  }
  radioChange(val){
    this.currentSection = val;
  }
  onPermissionSubmit(formDirective:FormGroupDirective){
    if (this.permissionForm.valid) {
      this.appService.createPermission(this.permissionForm.value).subscribe((res: any) => {
        this.permissionForm.reset();
        formDirective.resetForm();
        this.toastr.showSuccess("Permission saved successfully","Success")
        this.getAllRoles();
        this.getAllPermissions();
      });
    }
  }

}
