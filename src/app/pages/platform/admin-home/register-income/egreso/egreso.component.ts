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

  datosParqueadero: any;
  datosSuscripcion: any;
  datosLog: any;
  totalPagar: number = 0;
  cantidadHoras: number;
  cantidadDias: number;
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
    if (this.datosSuscripcion['pagado']){
      this.totalPagar = 0;
    } else {

      const tipoSubs = this.datosSuscripcion['tipoSuscripcion'];
      const ingreso = new Date(this.datosSuscripcion['fechaInicio']['seconds'] * 1000);

      if (tipoSubs === 'hora') {
        this.cantidadHoras = Math.ceil(moment(new Date()).diff(ingreso, 'hours', true));
        this.totalPagar = this.retornarvalor(this.cantidadHoras);
      } else if (tipoSubs === 'dia' ){
        this.cantidadDias = Math.ceil(moment(new Date()).diff(ingreso, 'days', true));
        this.totalPagar = this.retornarvalor(this.cantidadDias);
      } else {
        this.totalPagar = this.datosSuscripcion['valor']
      }
    }
  }

  retornarvalor(cantidad: number){
    return cantidad * this.datosSuscripcion['valor'];
  }


  egresar(){
    if (this.datosSuscripcion.tipoSuscripcion !== 'mes'){
      this.finalizarSuscripcion(this.data['suscripcion']['suscripcion']);
    } else {
      this.dialogRef.close({ cerrar: true, valor: this.totalPagar });
    }
  }

  print(){
    let factura = document.getElementById('factura');
    let printWindow = window.open(' ', 'popimpr');
    let estilos: string = `
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <style>
      .no-margin{
        margin: 0px;
      }

      body{
        width: 370px;
        border: 1px solid;
        border-radius: 5px;
        margin: 5px;
      }

      img{
        width: 150px;
      }

      .w-30{
        width: 30% !important;
      }

      .w-70{
        width: 70% !important;
      }

      .cuerpo-factura{
        padding: 10px;
      }

      .seccion{
        border-radius: 10px;
        border: 1px solid #b3acac;
        padding: 10px;
        margin: 5px;
        background-color: #fbfaf9;
      }

      .aceptar{
        background-color: #104407;
        color: white;
      }

    </style>`;
    printWindow.document.write(estilos + factura.innerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }

  finalizarSuscripcion(idSuscripcion: string){
    this.db.modificar('suscripciones', idSuscripcion,{estado: false}).then(() => {
      console.log('susripción cerrada');
      this.dialogRef.close({ cerrar: true, valor: this.totalPagar });
    });
  }

}
