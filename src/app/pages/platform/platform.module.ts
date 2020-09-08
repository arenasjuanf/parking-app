import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformRoutingModule } from './platform-routing.module';
import { MatInputModule } from '@angular/material/input';
import { PlatformComponent } from './platform.component';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    PlatformComponent
  ],
  imports: [
    CommonModule,
    PlatformRoutingModule,
    MatInputModule,
    MatFormFieldModule
  ]

})
export class PlatformModule { }
