import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-create-employee-dialogue',
  templateUrl: './create-employee-dialogue.component.html',
  styleUrls: ['./create-employee-dialogue.component.css']
})
export class CreateEmployeeDialogueComponent implements OnInit {

  typeLable = 'Create';
  roles =[];
  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeDialogueComponent>,
    private fb: FormBuilder,
    private api: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  employeeForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    address: [""],
    contact: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    joining_date: ["", Validators.required],
    birth_date: ["", Validators.required],
    designation: ["", Validators.required],
    id: [""]
  });
  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.getAllRoles();
    if (this.data && this.data.action) {
      if (this.data.action === 'edit') {
        this.employeeForm.patchValue(this.data);
        this.typeLable = 'Edit';
      } else if (this.data.action === 'create') {
        this.typeLable = 'Create';
      }
      delete this.data.action;
    }
  }
  getAllRoles() {
    this.api.getAllRoles().subscribe((res: any) => {
      this.roles = res.data;
    });
  }

  onSubmit() {
    let formData = this.employeeForm.value;
    if (!this.employeeForm.get('id').value) {
      delete formData.id;
      if (this.employeeForm.valid) {
        this.api.saveEmployee(formData).subscribe((res: any) => {
          if (res && res.res.affectedRows == 1) {
            this.close();
          }
        });
      }
    } else {
      this.api.updateEmployee(formData).subscribe((res: any) => {
        if (res && res.res.affectedRows == 1) {
          this.close();
        }
      });
    }
  }
}
