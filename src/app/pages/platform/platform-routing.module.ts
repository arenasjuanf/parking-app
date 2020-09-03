import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminHomeComponent } from './super-admin-home/super-admin-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ClientesHomeComponent } from './clientes-home/clientes-home.component';



const routes: Routes = [
    { path: 'superAdmin/home', component: SuperAdminHomeComponent},
    { path: 'admin/home', component: AdminHomeComponent },
    { path: 'cliente/home', component: ClientesHomeComponent }
    //{ path: "", component: AgendaComponent, data: { animation: 'agenda' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlatformRoutingModule { }
