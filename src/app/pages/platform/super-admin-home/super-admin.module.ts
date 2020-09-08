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


@NgModule({
  declarations: [
    SuperAdminHomeComponent,
    ParqueaderosComponent
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
    MatIconModule
  ]

})
export class SuperAdminModule { }
