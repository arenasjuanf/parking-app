import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  permisos: Array<any> = [];
  labels = constantes.permisos;

  nombreParqueadero: string;
  constructor(private router: Router, private auth: AuthService, private db: DatabaseService) {
    this.getDataParqueadero();
    this.getPermisos();
  }

  ngOnInit(): void { }

  getDataParqueadero() {
    const idParqueadero = this.auth.datosUsuario.parqueadero;
    this.db.findDoc('parqueaderos', idParqueadero).snapshotChanges().subscribe(result => {
      this.nombreParqueadero = result.payload.get('razonSocial');
    });
  }

  ir(ruta) {
    this.router.navigateByUrl(`/platform/admin/${ruta}`);
  }

  getPermisos() {
    this.permisos = this.auth.datosUsuario['permisos'];
  }

}
