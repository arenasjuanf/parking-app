import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.scss']
})
export class RegisterIncomeComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.dataUser = this.authService.datosUsuario;
  }

  formRegisterIncome: FormGroup;
  branchVehicles: Array<object> = [{ value: 'moto', view: 'Moto' }, { value: 'carro', view: 'Carro' }];
  dataUser;

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

  searchDataUser(evento) {
    console.log("Evento ", evento);
  }

  saveDataRegister() {

  }

}
