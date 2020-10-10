import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error404Component } from '../error404/error404.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ClientesHomeComponent } from './clientes-home/clientes-home.component';



const routes: Routes = [
    { path: 'superAdmin', loadChildren: () => import('./super-admin-home/super-admin.module').then(m => m.SuperAdminModule)},
    { path: 'admin', loadChildren: () => import('./admin-home/admin-home.module').then(m => m.AdminHomeModule) },
    { path: 'cliente', component: ClientesHomeComponent },
    { path: '404', component: Error404Component },
    { path: '**', pathMatch: 'full', redirectTo: '404' }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlatformRoutingModule { }
