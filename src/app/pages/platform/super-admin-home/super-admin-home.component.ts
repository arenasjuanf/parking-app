import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrls: ['./super-admin-home.component.scss']
})
export class SuperAdminHomeComponent implements OnInit {
  opened: boolean = true;
  rutaActual:string;

  constructor(public auth: AuthService, private router: Router) {
    this.rutaActual = this.router.url;
  }
  
  public menus:object[] = [
    { nombre: 'parqueaderos', ruta: '/parqueaderos', faIcon: 'fas fa-parking  fa-lg'},
    { nombre: 'historial usuarios', ruta: '/usuarios', faIcon: 'fas fa-users  fa-lg' },

  ];

  fecha = new Date();
  ngOnInit(): void {
  }

  validar(){
    this.auth.cerrarSesion();
  }

  goTo(route){
    const ruta = '/platform/superAdmin' + route;
    this.router.navigateByUrl(ruta);
    this.rutaActual = ruta;
  }

  panel(drawer){
    this.opened = drawer.opened;
  }

  logout(){
    this.auth.cerrarSesion();
  }

}
