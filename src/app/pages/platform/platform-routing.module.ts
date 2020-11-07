import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SesionIniciadaGuard } from 'src/app/guards/sesion-iniciada.guard';
import { ValidarAdmin } from 'src/app/guards/validar-admin.guard';
import { ValidarCliente } from 'src/app/guards/validar-cliente.guard';
import { ValidarSuperAdmin } from 'src/app/guards/validar-superAdmin.guard';
import { Error404Component } from '../error404/error404.component';
import { LoginComponent } from '../login/login.component';
import { ClientesHomeComponent } from './clientes-home/clientes-home.component';

const routes: Routes = [
    {
        path: 'superAdmin',
        loadChildren: () => import('./super-admin-home/super-admin.module').then(m => m.SuperAdminModule),
        canActivate: [ValidarSuperAdmin]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-home/admin-home.module').then(m => m.AdminHomeModule),
        canActivate: [ValidarAdmin]
    },
    {
        path: 'cliente',
        component: ClientesHomeComponent,
        canActivate: [ValidarCliente]
    },
    {
        path: '',
        component: LoginComponent,
        canActivate: [SesionIniciadaGuard]
    },
    { path: '404', component: Error404Component },
    { path: '**', pathMatch: 'full', redirectTo: '404' }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlatformRoutingModule { }
