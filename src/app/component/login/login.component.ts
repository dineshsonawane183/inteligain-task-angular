import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginInvalid: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: AppService,
    private toastr : NotificationService
  ) { }

  loginForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  ngOnInit(): void {
  }
  onSubmit() {
    let params = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    }
    this.api.login(params).subscribe((res: any) => {
      this.loginInvalid = true;
      if (res.status === "success") {
        localStorage.setItem("token", res.token);
        this.api.loggedInData = JSON.stringify(res.data);
        localStorage.setItem('loginData',JSON.stringify(res.data))
        this.loginInvalid = false;
        this.toastr.showSuccess("Login Successfully!","Success");
        this.router.navigate(["/dashboard"]);
      } else {
        setTimeout(() => {
          this.loginInvalid = false;
        }, 3000)
      }
    });
  }

  registerBtnClicked(){
    this.router.navigate(['/register']);
  }
}
