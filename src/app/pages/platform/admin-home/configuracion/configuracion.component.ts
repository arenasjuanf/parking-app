import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  tarifas: any;
  arrayTarifas: string[];

  constructor(private db: DatabaseService, private auth: AuthService, private router: Router) {
    this.traertarifas()
  }

  ngOnInit(): void {
  }

  traertarifas(){
    const idParqueadero = this.auth.datosUsuario.parqueadero;
    this.db.findDoc('parqueaderos', idParqueadero).snapshotChanges().subscribe( result => {
      this.tarifas = result.payload.get('tarifas');
      this.arrayTarifas = Object.keys(this.tarifas);
    }, error => {
      console.log('error: ', error);
    });
  }

  volver() {
    this.router.navigateByUrl('/platform/admin/main');
  }
  
}
