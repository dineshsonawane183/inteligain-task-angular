import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-edit-user-dialogue',
  templateUrl: './edit-user-dialogue.component.html',
  styleUrls: ['./edit-user-dialogue.component.css']
})
export class EditUserDialogueComponent implements OnInit {

  typeLable = 'Create';
  roles = [];
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogueComponent>,
    private fb: FormBuilder,
    private toastr: NotificationService,
    private api: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  userForm: FormGroup = this.fb.group({
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    role_type: ["", Validators.required],
    user_name: ["", [Validators.required]],
  });
  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log(this.data);
    this.userForm.patchValue(this.data);
    this.getAllRoles();

  }
  getAllRoles() {
    this.api.getAllRoles().subscribe((res: any) => {
      this.roles = res.data;
      this.userForm.get('role_type').patchValue(this.data.role_type);
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      let itm = this.roles.filter((item)=>{
        return item.ROLE_TYPE === this.userForm.value.role_type
      })
      let params = {
        ...this.userForm.value,
        role_id : itm[0].ID,
        id: this.data.id
      }
      delete params.role_type;
      this.api.updateUserDetails(params).subscribe((res: any) => {
        if (res.status == "success") {
          this.toastr.showSuccess("User saved Successfully!", "Success");
        }
        this.close();
      });
    }
  }
}
