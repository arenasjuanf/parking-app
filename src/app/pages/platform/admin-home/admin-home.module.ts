import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { MainComponent } from './main/main.component';



@NgModule({
  declarations: [
    AdminHomeComponent,
    UsuariosComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    MatFormFieldModule
  ]

})
export class AdminHomeModule { }
