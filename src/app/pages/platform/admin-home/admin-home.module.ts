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
import { MensualidadComponent } from './mensualidad/mensualidad.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    UsuariosComponent,
    MainComponent,
    ModalUsuariosComponent,
    MensualidadComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]

})
export class AdminHomeModule { }
