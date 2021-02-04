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


  statusArray = [
    { name: "To Do", value: "todo" },
    { name: "In Progress", value: "in progress" },
    { name: "Completed", value: "completed" }
  ];
  assignedToArray :Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeDialogueComponent>,
    private fb: FormBuilder,
    private api: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    employeeForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    address: [""],
    contact: ["", Validators.required],
    email: ["", Validators.required],
    joining_date: ["", Validators.required],
    birth_date: ["", Validators.required],
  });
  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.api.getUsers().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.assignedToArray = res.data;
      }
    });
  }
  onSubmit() {
    if(this.employeeForm.valid){
      this.api.saveEmployee(this.employeeForm.value).subscribe((res:any)=>{
        if(res && res.res.affectedRows == 1){
          this.close();
        }
      });
    }
  }
}
