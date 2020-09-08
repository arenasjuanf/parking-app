import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminHomeComponent } from './super-admin-home/super-admin-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ClientesHomeComponent } from './clientes-home/clientes-home.component';



const routes: Routes = [
    { path: 'superAdmin', loadChildren: () => import('./super-admin-home/super-admin.module').then(m => m.SuperAdminModule)},
    { path: 'admin', component: AdminHomeComponent },
    { path: 'cliente', component: ClientesHomeComponent }
    //{ path: "", component: AgendaComponent, data: { animation: 'agenda' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlatformRoutingModule { }
