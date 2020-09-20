import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home.component';
import { MainComponent } from './main/main.component';
import { UsuariosComponent } from './usuarios/usuarios.component';



const routes: Routes = [
    { path: '', component: AdminHomeComponent , 
        children:[
            { path: 'main', component: MainComponent },
            { path: 'usuarios', component: UsuariosComponent },
            { path: '**', pathMatch: 'full', redirectTo: 'main' },
        ]
    },
    { path: '**', pathMatch:'full', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
