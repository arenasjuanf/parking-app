import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './pages/login/login.component';
import { SuperAdminHomeComponent } from './pages/super-admin-home/super-admin-home.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { ClientesHomeComponent } from './pages/clientes-home/clientes-home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SuperAdminHomeComponent,
    AdminHomeComponent,
    ClientesHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
