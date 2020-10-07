import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.scss']
})
export class RegisterIncomeComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataBaseService: DatabaseService
  ) {
    this.dataUser = this.authService.datosUsuario;
    this.getFloorsParking();
  }

  formRegisterIncome: FormGroup;
  branchVehicles: Array<object> = [{ value: 'moto', view: 'Moto' }, { value: 'carro', view: 'Carro' }];
  dataUser;
  floorsParking;

  ngOnInit(): void {
    this.configForm();
    console.log("Datos del usuario ", this.dataUser);
  }

  configForm() {
    this.formRegisterIncome = this.formBuilder.group({
      documentoUsuario: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      tipoVehiculo: ['', Validators.required],
      piso: ['', Validators.required],
      seccionPiso: ['', Validators.required],
      parqueadero: [this.dataUser['parqueadero'], Validators.required],
    });
  }

  getFloorsParking() {
    this.dataBaseService.findDoc("parqueaderos", this.dataUser['parqueadero']).snapshotChanges().subscribe(respuesta => {
      this.floorsParking = respuesta.payload.get('pisos');
    }, error => {
      console.log("Error ", error);
    });
  }

  searchDataUser(evento?) {
    let valor = evento ? evento.srcElement.value : this.formRegisterIncome.get('documentoUsuario').value;
    this.dataBaseService.getPorFiltro("usuarios", "documento", valor).snapshotChanges().pipe(
      map((options: Array<any>) => {
        return options.map(option => ({ ...option.payload.doc.data(), key: option.payload.doc.id }))
      })
    ).subscribe(respuesta => {
      console.log("Respuesta ", respuesta);
    }, error => {
      console.log("Error ", error);
    });
    console.log("valor despues de tomado ", valor);
  }

  saveDataRegister() {
    if (this.formRegisterIncome.valid) {
      console.log("Formulario ", this.formRegisterIncome.value);
    } else {
      this.formRegisterIncome.markAsTouched();
    }
  }

}
