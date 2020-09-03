import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SuperAdminHomeComponent } from './pages/super-admin-home/super-admin-home.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { ClientesHomeComponent } from './pages/clientes-home/clientes-home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'superAdmin/home', component: SuperAdminHomeComponent},
  { path: 'admin/home', component: AdminHomeComponent },
  { path: 'cliente/home', component: ClientesHomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot( routes )
  ], exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
