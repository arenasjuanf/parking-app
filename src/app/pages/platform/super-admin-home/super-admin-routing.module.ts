import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParqueaderosComponent } from './parqueaderos/parqueaderos.component';
import { SuperAdminHomeComponent } from './super-admin-home.component';
import { HistorialUsuariosComponent } from './historial-usuarios/historial-usuarios.component';



const routes: Routes = [
    { path: '', component: SuperAdminHomeComponent , 
        children:[
            { path: 'parqueaderos', component: ParqueaderosComponent },
            { path: 'usuarios', component: HistorialUsuariosComponent },
            { path: '**', pathMatch: 'full', redirectTo: 'parqueaderos' },
        ]
    },
    { path: '**', pathMatch:'full', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
