/* modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules-material */
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs'; 

const MODULES = [
    CommonModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    MatTabsModule
]

@NgModule({
    declarations: [],
    imports: MODULES,
    exports: MODULES
})
export class MaterialModule { }
