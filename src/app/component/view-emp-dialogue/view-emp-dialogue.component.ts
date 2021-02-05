import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';
import { CreateEmployeeDialogueComponent } from '../create-employee-dialogue/create-employee-dialogue.component';

@Component({
  selector: 'app-view-emp-dialogue',
  templateUrl: './view-emp-dialogue.component.html',
  styleUrls: ['./view-emp-dialogue.component.css']
})
export class ViewEmployeeDialogueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewEmployeeDialogueComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private api: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
   
  }
  role(){
    return this.api.CURRENT_ROLE;
  }
  editEmployee(){
    let data = {...this.data,action:"edit"}
    const dialogRef = this.dialog.open(CreateEmployeeDialogueComponent, {
      width: '60%',
      height: '88%',
      disableClose: true,
      data:data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.close();
    });
  }
 
}
