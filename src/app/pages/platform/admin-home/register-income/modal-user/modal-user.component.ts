import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dataBaseService: DatabaseService,
  ) { }

  formRegisterUser: FormGroup;
  branchVehicles: Array<object> = [{ value: 'moto', view: 'Moto' }, { value: 'carro', view: 'Carro' }];
  formVehiculo: FormGroup;

  ngOnInit(): void {
    this.initUserForm();
    this.initVehiForm();

    if (this.data.editarUsuario) {
      this.formRegisterUser.patchValue(this.data.datos);
    } else {
      this.formRegisterUser.get('documento').setValue(this.data.documento);
    }
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

  saveUser() {
    if (this.formRegisterUser.valid) {
      if (this.data.editarUsuario) {
        const datos = Object.assign({}, this.formRegisterUser.value);
        this.dataBaseService.modificar('usuarios', this.data.datos.key, datos).then(result => {
          datos['key'] = this.data.datos.key;
          //this.closeDialog(datos);
        }).catch(error => {
          console.log('Error modificar usuario :', error);
        });
      } else {
        const datos = Object.assign({}, this.formRegisterUser.value);
        datos['password'] = datos.documento;
        this.dataBaseService.addData("usuarios", this.formRegisterUser.value).then(respuesta => {
          datos['key'] = respuesta.id;
          this.saveVehicle(datos);

        });
      }
    } else {
      this.formRegisterUser.markAsTouched();
    }
  }

  saveVehicle(datosUsuario){
    const datosVehiculo = Object.assign({}, this.formVehiculo.value);
    datosVehiculo['usuario'] = datosUsuario.key;
    this.dataBaseService.addData('vehiculos', datosVehiculo).then(respuesta => {
      datosVehiculo['key'] = respuesta.id;
      this.dialogRef.close({datosUsuario, datosVehiculo});
    });
  }


}
