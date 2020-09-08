import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrls: ['./super-admin-home.component.scss']
})
export class SuperAdminHomeComponent implements OnInit {
  opened: boolean = true;

  constructor(public auth: AuthService) { }
  
  public menus:object[] = [
    { nombre: 'parqueaderos', ruta: '/parqueaderos', faIcon: 'fas fa-parking  fa-lg'},
    { nombre: 'usuarios', ruta: '/usuarios', faIcon: 'fas fa-users  fa-lg' },

  ];

  fecha = new Date();
  ngOnInit(): void {
  }

  validar(){
    this.auth.cerrarSesion();
  }

  goTo(ruta){
    console.log({ruta});
  }

  panel(drawer){
    this.opened = drawer.opened;
  }

}
