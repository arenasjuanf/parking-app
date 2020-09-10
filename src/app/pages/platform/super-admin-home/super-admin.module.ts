import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SuperAdminHomeComponent } from './super-admin-home.component';
import { ParqueaderosComponent } from './parqueaderos/parqueaderos.component';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HistorialUsuariosComponent } from './historial-usuarios/historial-usuarios.component';
import { GestionParqueaderoComponent } from './gestion-parqueadero/gestion-parqueadero.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { VistaPlanosComponent } from './vista-planos/vista-planos.component';


@NgModule({
  declarations: [
    SuperAdminHomeComponent,
    ParqueaderosComponent,
    HistorialUsuariosComponent,
    GestionParqueaderoComponent,
    VistaPlanosComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    SuperAdminRoutingModule,
    MatTabsModule,
    MatSidenavModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule
  ]

})
export class SuperAdminModule { }
