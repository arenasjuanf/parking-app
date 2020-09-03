import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PlatformComponent } from './pages/platform/platform.component';
import { SuperAdminHomeComponent } from './pages/platform/super-admin-home/super-admin-home.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'platform', loadChildren: () => import('./pages/platform/platform.module').then(m => m.PlatformModule) },
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
