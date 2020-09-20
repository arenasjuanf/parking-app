import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  permisos: object[] = [
    {nombre: 'registrar ingreso',
      ruta: 'ingreso',
      icono: 'far fa-plus-square fa-7x'
    },
    {
      nombre: 'registrar egreso',
      ruta: 'egreso',
      icono: 'fas fa-sign-out-alt fa-7x'
    },
    {
      nombre: 'datos parqueadero',
      ruta: 'datos-parqueadero',
      icono: 'fas fa-pencil-alt fa-7x'
    },
    {
      nombre: 'informe',
      ruta: 'informe',
      icono: 'fas fa-file-alt fa-7x'
    },
    {
      nombre: 'mensualidad',
      ruta: 'mensualidad',
      icono: 'far fa-credit-card fa-7x'
    },
    {
      nombre: 'configuracion',
      ruta: 'configuracion',
      icono: 'fas fa-user fa-7x'
    },
    {
      nombre: 'usuarios',
      ruta: 'usuarios',
      icono: 'fas fa-cog fa-7x'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
