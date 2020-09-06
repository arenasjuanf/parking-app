import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParqueaderosComponent } from './parqueaderos/parqueaderos.component';
import { SuperAdminHomeComponent } from './super-admin-home.component';



const routes: Routes = [
    { path: '', component: SuperAdminHomeComponent , 
        children:[
            { path: '', redirectTo:'parqueaderos'},
            { path: 'parqueaderos', component: ParqueaderosComponent },
        ]
    },
    { path: '**', pathMatch:'full', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
