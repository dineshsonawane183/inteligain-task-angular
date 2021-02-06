import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-role-dialogue',
  templateUrl: './role-dialogue.component.html',
  styleUrls: ['./role-dialogue.component.css']
})
export class RoleDialogueComponent implements OnInit {

  typeLable = 'Create';
  roles = [];
  permissions= [];
  constructor(
    public dialogRef: MatDialogRef<RoleDialogueComponent>,
    private fb: FormBuilder,
    private toastr: NotificationService,
    private api: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    roleForm: FormGroup = this.fb.group({
      role_type: ["", Validators.required],
      role_description: ["", Validators.required],
      parent: ["", Validators.required],
      permission: ["", Validators.required],
    });
  close(): void {
    this.dialogRef.close();
  }
 
  onSubmit(formDirective: FormGroupDirective) {
  if(this.data.type == "create"){
    if (this.roleForm.valid) {
      this.api.createRole(this.roleForm.value).subscribe((res: any) => {
        this.roleForm.reset();
        formDirective.resetForm();
        this.toastr.showSuccess("Role saved successfully", "Success");
        this.close();
      });
    }
  }else{
    if (this.roleForm.valid) {
      let params = {
        ...this.roleForm.value,
        id: this.data.formData.ID
      }
      this.api.updateRole(params).subscribe((res: any) => {
        this.roleForm.reset();
        formDirective.resetForm();
        this.toastr.showSuccess("Role saved successfully", "Success");
        this.close();
      });
    }
  }
  }
  ngOnInit(): void {
    this.roles = this.data.roles;
    console.log("roles",this.roles);
    this.permissions = this.data.permissions;
    this.typeLable = 'Create';
    if( this.data.type == "edit"){
      this.typeLable = 'Edit';
      const dt =this.data.formData;
      let data = {
        role_type: dt.ROLE_TYPE,
        role_description: dt.ROLE_DESCRIPTION,
        parent: dt.parent+"",
        permission: dt.PERMISSION_ID_FK+"",
      }
        this.roleForm.patchValue(data);
    }
  }

 
}
