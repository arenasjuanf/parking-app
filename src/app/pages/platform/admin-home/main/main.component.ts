import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  permisos: object[] = [
    { nombre: 'registrar ingreso',
      ruta: 'ingreso',
      icono: 'far fa-plus-square'
    },
    {
      nombre: 'registrar egreso',
      ruta: 'egreso',
      icono: 'fas fa-sign-out-alt'
    },
    {
      nombre: 'datos parqueadero',
      ruta: 'datos-parqueadero',
      icono: 'fas fa-pencil-alt'
    },
    {
      nombre: 'informe',
      ruta: 'informe',
      icono: 'fas fa-file-alt'
    },
    {
      nombre: 'mensualidad',
      ruta: 'mensualidad',
      icono: 'far fa-credit-card'
    },
    {
      nombre: 'usuarios',
      ruta: 'usuarios',
      icono: 'fas fa-user'
    },
    {
      nombre: 'configuracion',
      ruta: 'configuracion',
      icono: 'fas fa-cog'
    }
  ];


  nombreParqueadero: string;
  constructor(private router: Router, private auth: AuthService, private db: DatabaseService) { 
    this.getDataParqueadero();
  }

  ngOnInit(): void {
  }

  getDataParqueadero(){
    const idParqueadero = this.auth.datosUsuario.parqueadero;
    this.db.findDoc('parqueaderos', idParqueadero ).snapshotChanges().subscribe(
      result => {
        this.nombreParqueadero = result.payload.get('razonSocial');
      }
    )
  }

  ir(ruta){
    this.router.navigateByUrl(`/platform/admin/${ruta}`);
  }

}
