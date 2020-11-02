import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NotificationService } from '../../../services/notification.service';
import { constantes } from 'src/app/constantes';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  vehiculos: any[];

  constructor(
    public dialogRef: MatDialogRef<VehiculosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private db: DatabaseService,
    private notify: NotificationService
  ) {
    this.initVehiForm();
    this.traerVehiculos();
  }

  formRegisterUser: FormGroup;
  branchVehicles: Array<object> = constantes.branchVehicles;
  formVehiculo: FormGroup;
  mostrarForm = false;
  ngOnInit(): void {
    console.log(this.data);
  }

  initUserForm() {
    this.formRegisterUser = this.formBuilder.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      tipo: ['cliente', Validators.required],
      parqueadero: [this.data['parqueadero'], Validators.required],
    });
  }

  initVehiForm() {
    this.formVehiculo = this.formBuilder.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      color: ['', Validators.required],
      tipo: ['', Validators.required],
      parqueadero: [this.data['parqueadero'], Validators.required],
      usuario: [this.data['key'], Validators.required]
    });
  }

  closeDialog(data?) {
    this.dialogRef.close(data);
  }


  traerVehiculos() {
    this.db.getPorFiltro('vehiculos', 'usuario', this.data.key).snapshotChanges().subscribe(respuesta => {
      const datos = respuesta.map(item => {
        let x = item.payload.doc.data();
        x['key'] = item.payload.doc.id;
        return x;
      });

      console.log(datos);
      this.vehiculos = datos;

    }, error => {
      console.log("Error ", error);
    });
  }


  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.formVehiculo.valid) {
      const data = Object.assign({}, this.formVehiculo.value);
      this.db.addData('vehiculos', data).then(result => {
        console.log({ result });
        this.mostrarForm = false;
        this.notify.notification("success", "Vehiculo creado");
      }).catch(error => {
        console.log({ error });
        this.notify.notification("error", "Error al crear vehiculo");
      });
    } else {
      this.notify.notification("warning", "Ingrese todos los datos");
    }
  }


}
