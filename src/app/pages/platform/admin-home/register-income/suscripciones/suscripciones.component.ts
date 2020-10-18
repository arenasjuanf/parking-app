import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NotificationService } from '../../../services/notification.service';
import * as moment from 'moment'; 


@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.component.html',
  styleUrls: ['./suscripciones.component.scss']
})
export class SuscripcionesComponent implements OnInit {

  vehiculos: any[];
  tarifas: any;
  arrayTarifas: string[];
  branchVehicles: Array<object> = [{ value: 'moto', view: 'Moto' }, { value: 'carro', view: 'Carro' }];
  form: FormGroup;
  mostrarForm = false;
  suscripcionActiva: boolean = false;
  inactivas: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SuscripcionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private db: DatabaseService,
    private notify: NotificationService
  ) {
    this.traerTarifas();
    this.traerSuscripciones();
    this.initForm();
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  initForm() {
    this.form = this.formBuilder.group({
      tipoSuscripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      estado: [true, Validators.required],
      valor: [true, Validators.required],
      pagado: [false, Validators.required],
      parqueadero: [this.data.datosVehiculo['parqueadero'], Validators.required],
      vehiculo: [this.data.datosVehiculo['key'], Validators.required],
    });
  }

  closeDialog(data?) {
    this.dialogRef.close(data);
  }

  cerrar(){
    this.dialogRef.close();
  }

  guardar(){
    console.log(this.form.value);
    this.db.addData('suscripciones', this.form.value).then(result => {
      console.log({result});
      this.mostrarForm = false;
      this.notify.notification("success", "Suscripción creada");

    }).catch( error => {
      console.log({error});
      this.notify.notification("error", "Error al crear suscripción");
    })
  }

  traerTarifas(){
    console.log(this.data.datosVehiculo.parqueadero)
    this.db.findDoc('parqueaderos', this.data.datosVehiculo.parqueadero).snapshotChanges().subscribe(result => {
      if(result){
        this.tarifas = result.payload.get('tarifas');
        this.arrayTarifas = Object.keys(this.tarifas);
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  setearPrecio(tipo){
    const tipovh = this.data.datosVehiculo['tipo'];
    this.form.get('valor').setValue(this.tarifas[tipo][tipovh]);

  }

  traerSuscripciones(){
    this.db.getPorFiltro('suscripciones', 'vehiculo', this.data.datosVehiculo['key']).snapshotChanges().subscribe(respuesta=>{
      const datos = respuesta.map(item => {
        let x = item.payload.doc.data();
        x['key'] = item.payload.doc.id;
        return x;
      });

      datos.forEach((s:any) => {
        if(!s.estado){
          this.inactivas.push(s)
        }else{
          this.suscripcionActiva = s;
        }
      });
      console.log(this.suscripcionActiva);
      this.mostrarForm = this.suscripcionActiva ? false : true;
    })
  }

  toDate(hora){
    if(hora){
      return moment(new Date(hora.seconds * 1000)).locale('es').format('ll');
    }
  }

  tiempoRestante(final){
    if(final){
      const start = moment(new Date());
      const end = moment(new Date(final.seconds * 1000))

      return end.diff(start, 'days') + ' días';
    }
  }

}
