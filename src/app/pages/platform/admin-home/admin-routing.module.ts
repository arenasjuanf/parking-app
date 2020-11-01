import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MainComponent } from './main/main.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegisterIncomeComponent } from './register-income/register-income.component';
import { MensualidadComponent } from './mensualidad/mensualidad.component';
import { DatosParqueaderoComponent } from './datos-parqueadero/datos-parqueadero.component';
import { InformeComponent } from './informe/informe.component';



const routes: Routes = [
    {
        path: '', component: AdminHomeComponent,
        children: [
            { path: 'main', component: MainComponent },
            { path: 'informe', component: InformeComponent },
            { path: 'usuarios', component: UsuariosComponent },
            { path: 'ingreso', component: RegisterIncomeComponent },
            { path: 'mensualidad', component: MensualidadComponent},
            { path: 'configuracion', component: ConfiguracionComponent },
            { path: 'datos-parqueadero', component: DatosParqueaderoComponent },
            { path: '**', pathMatch: 'full', redirectTo: 'main' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
