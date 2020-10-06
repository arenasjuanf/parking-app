import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { MainComponent } from './main/main.component';
import { MatCardModule } from '@angular/material/card';
import { ModalUsuariosComponent } from './usuarios/modal-usuarios/modal-usuarios.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformModule } from '../platform.module';
import { SuperAdminModule } from '../super-admin-home/super-admin.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterIncomeComponent } from './register-income/register-income.component';
import { MatSelectModule } from '@angular/material/select';




@NgModule({
  declarations: [
    AdminHomeComponent,
    UsuariosComponent,
    MainComponent,
    ModalUsuariosComponent,
    RegisterIncomeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PlatformModule,
    SuperAdminModule,
    MatSelectModule,
  ]

})
export class AdminHomeModule { }
