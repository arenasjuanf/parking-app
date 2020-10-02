import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformRoutingModule } from './platform-routing.module';
import { MatInputModule } from '@angular/material/input';
import { PlatformComponent } from './platform.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PlatformComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    PlatformRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    NavbarComponent
  ]

})
export class PlatformModule { }
