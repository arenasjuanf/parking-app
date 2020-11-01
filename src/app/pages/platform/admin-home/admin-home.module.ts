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
import { ModalUserComponent } from './register-income/modal-user/modal-user.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DatosParqueaderoComponent } from './datos-parqueadero/datos-parqueadero.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MensualidadComponent } from './mensualidad/mensualidad.component';
import { PermisosComponent } from './usuarios/permisos/permisos.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PlanosAsignacionComponent } from './planos-asignacion/planos-asignacion.component';
import { MatTableModule } from '@angular/material/table';
import { ModalValueRateComponent } from './configuracion/modal-value-rate/modal-value-rate.component';
import { MatStepperModule } from '@angular/material/stepper';
import { VehiculosComponent } from './register-income/vehiculos/vehiculos.component';
import { SuscripcionesComponent } from './register-income/suscripciones/suscripciones.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ModalSuscripcionesComponent } from './mensualidad/modal-suscripciones/modal-suscripciones.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EgresoComponent } from './register-income/egreso/egreso.component';
import { InformeComponent } from './informe/informe.component';



@NgModule({
  declarations: [
    AdminHomeComponent,
    UsuariosComponent,
    MainComponent,
    ModalUsuariosComponent,
    RegisterIncomeComponent,
    ModalUserComponent,
    MensualidadComponent,
    ConfiguracionComponent,
    DatosParqueaderoComponent,
    PermisosComponent,
    PlanosAsignacionComponent,
    ModalValueRateComponent,
    MensualidadComponent,
    VehiculosComponent,
    SuscripcionesComponent,
    ModalSuscripcionesComponent,
    EgresoComponent,
    InformeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
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
    MatExpansionModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    MatStepperModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
    MatPaginatorModule
  ], exports:[
    MatSortModule
  ]

})
export class AdminHomeModule { }
