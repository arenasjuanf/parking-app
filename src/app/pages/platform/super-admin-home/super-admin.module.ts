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
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerfilComponent } from './perfil/perfil.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NavbarComponent } from '../navbar/navbar.component';
import { PlatformModule } from '../platform.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    SuperAdminHomeComponent,
    ParqueaderosComponent,
    HistorialUsuariosComponent,
    GestionParqueaderoComponent,
    VistaPlanosComponent,
    PerfilComponent
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
    MatExpansionModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    NgxLoadingModule.forRoot({})
  ], exports:[
    PerfilComponent
  ]

})
export class SuperAdminModule { }
