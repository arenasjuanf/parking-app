/* modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules-material */
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';

const MODULES = [
    CommonModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule
]

@NgModule({
    declarations: [],
    imports: MODULES,
    exports: MODULES
})
export class MaterialModule { }
