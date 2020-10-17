import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';

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
    private dataBaseService: DatabaseService,
  ) { 
    this.traerVehiculos();
  }

  formRegisterUser: FormGroup;
  branchVehicles: Array<object> = [{ value: 'moto', view: 'Moto' }, { value: 'carro', view: 'Carro' }];
  formVehiculo: FormGroup;

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
    });
  }

  closeDialog(data?) {
    this.dialogRef.close(data);
  }


  traerVehiculos() {
    this.dataBaseService.getPorFiltro('vehiculos', 'usuario', this.data.key).snapshotChanges().subscribe(respuesta => {
      const datos = respuesta.map(item => {
        let x = item.payload.doc.data();
        x['key'] = item.payload.doc.id;
        return x;
      });

      this.vehiculos = datos;

    }, error => {
      console.log("Error ", error);
    });
  }





}
