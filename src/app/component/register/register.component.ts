import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: AppService,
    private toastr:NotificationService
  ) { }

  registerForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    firstname: ["", Validators.required],
    lastname: ["", Validators.required],
    email:["",[Validators.required,Validators.email]]
  });

  ngOnInit(): void {
  }
  onSubmit() {
    if(this.registerForm.valid){
      let params = {
        username: this.registerForm.get('username').value,
        password: this.registerForm.get('password').value,
        firstname: this.registerForm.get('firstname').value,
        lastname: this.registerForm.get('lastname').value,
        email:this.registerForm.get('email').value,
        role: this.api.DEFAULT_ROLE,
      }
      this.api.register(params).subscribe((res: any) => {
        if (res.status === "success") {
          this.toastr.showSuccess("Register Successfully!","Success");
          this.router.navigate(["/login"]);
        }
      });
    }else{
     //alert 
    }
  }
}
