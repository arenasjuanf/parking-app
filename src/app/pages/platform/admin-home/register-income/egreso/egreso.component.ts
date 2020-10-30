import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import * as moment from 'moment';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrls: ['./egreso.component.scss']
})
export class EgresoComponent implements OnInit {

  datosParqueadero: object;
  datosSuscripcion: object;
  datosLog: object;
  totalPagar: number = 0;
  cantidadHoras: number;
  constructor( 
    private auth: AuthService,
    private db: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EgresoComponent>,

  ) {
    this.traerDatosParqueadero();
  }

  ngOnInit(): void {
  }

  traerDatosParqueadero(){
    const idParqueadero = this.auth.datosUsuario.parqueadero;
    this.db.findDoc('parqueaderos', idParqueadero).valueChanges().subscribe((result: object) => {
      if(result){
        this.datosParqueadero = result;
        this.getlog();
        
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  getSuscripcion(){
    const idSuscripcion = this.data['suscripcion']['suscripcion'];
    this.db.findDoc('suscripciones', idSuscripcion).valueChanges().subscribe(
      (result: object) => {
        this.datosSuscripcion = result;
        this.calcularPago();
      }
    );
  }

  getlog(){
    const idLog = this.data['suscripcion']['idlog'];
    this.db.findDoc('logs', idLog).valueChanges().subscribe(
      (result: object) => {
        this.datosLog = result;
        this.getSuscripcion();
      }
    );

  }

  parsearFecha(seconds?, format: string = 'lll'){
    return seconds ? moment(new Date(seconds * 1000)).format(format) : moment(new Date()).format(format);
  }

  calcularPago(){

    this.totalPagar = this.datosSuscripcion['pagado'] ? 0 : this.datosSuscripcion['valor'];

    if(this.datosSuscripcion['tipoSuscripcion'] == 'hora'){
      const ingreso = new Date(this.datosLog['fechaEntrada']['seconds'] * 1000);
      this.cantidadHoras = Math.ceil(moment(new Date()).diff(ingreso, 'hours', true));
      if (this.cantidadHoras > 1){
        this.totalPagar = this.cantidadHoras * this.datosSuscripcion['valor'];
      }
    }

  }


  egresar(){
    this.dialogRef.close({cerrar:true , valor:this.totalPagar});
  }

}
