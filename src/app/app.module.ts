import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from './auth/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CreateEmployeeDialogueComponent } from './component/create-employee-dialogue/create-employee-dialogue.component';
import { ViewEmployeeDialogueComponent } from './component/view-emp-dialogue/view-emp-dialogue.component';
import { EmployeeDashboardComponent } from './component/employee-dashboard/employee-dashboard.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './component/role-config/role-config.component';
import { NotificationService } from './service/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './auth/token.interceptor';
import { EditUserDialogueComponent } from './component/edit-user-dialogue/edit-user-dialogue.component';
import { RoleDashboardComponent } from './component/role-dashboard/role-dashboard.component';
import { RoleDialogueComponent } from './component/role-dialogue/role-dialogue.component';
import { PermissionDashboardComponent } from './component/permission-dashboard/permission-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreateEmployeeDialogueComponent,
    ViewEmployeeDialogueComponent,
    EmployeeDashboardComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    EditUserDialogueComponent,
    RoleDashboardComponent,
    RoleDialogueComponent,
    PermissionDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  entryComponents:[
    CreateEmployeeDialogueComponent,
    ViewEmployeeDialogueComponent,
    EditUserDialogueComponent,
    RoleDialogueComponent,
  ],
  providers: [
    
    AuthGuardService,
    NotificationService,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
