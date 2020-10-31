import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SesionIniciadaGuard } from './guards/sesion-iniciada.guard';
import { ValidacionSesionGuard } from './guards/validacion-sesion.guard';
import { Error404Component } from './pages/error404/error404.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent,
    canActivate: [SesionIniciadaGuard]
  },
  {
    path: '404', 
    component: Error404Component 
  },
  {
    path: 'platform',
    loadChildren: () => import('./pages/platform/platform.module').then(m => m.PlatformModule),
    canActivate: [ValidacionSesionGuard]
  },
  {
    path: '',
    pathMatch:'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot( routes )
  ], exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
