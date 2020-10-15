import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalValueRateComponent } from './modal-value-rate/modal-value-rate.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  tarifas: any;
  arrayTarifas: string[];
  idParqueadero;

  constructor(
    private db: DatabaseService,
    private auth: AuthService,
    private router: Router,
    private matDialog: MatDialog,
  ) {
    this.idParqueadero = this.auth.datosUsuario.parqueadero;
    this.traertarifas()
  }

  ngOnInit(): void {
  }

  traertarifas() {
    this.db.findDoc('parqueaderos', this.idParqueadero).snapshotChanges().subscribe(result => {
      this.tarifas = result.payload.get('tarifas');
      this.arrayTarifas = Object.keys(this.tarifas);
    }, error => {
      console.log('error: ', error);
    });
  }

  volver() {
    this.router.navigateByUrl('/platform/admin/main');
  }

  paraProbar() {
    return true;
  }

  abrirModal(tipoTarifa) {
    const tarifaSelected = this.tarifas[tipoTarifa];
    const dialogo = this.matDialog.open(ModalValueRateComponent, {
      data: {
        valores: tarifaSelected,
        tiempo: tipoTarifa,
        parqueadero: this.idParqueadero
      },
      width: '20%',
      disableClose: true
    });
    dialogo.afterClosed().subscribe(respuesta => {
      if (respuesta) {}
    });
  }

}
