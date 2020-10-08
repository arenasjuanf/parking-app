import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserComponent } from './modal-user/modal-user.component';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.scss']
})
export class RegisterIncomeComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataBaseService: DatabaseService,
    public dialogComponent: MatDialog,
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
    this.dataBaseService.getPorFiltroEntreTexto("usuarios", "documento", valor, 'parqueadero', this.dataUser['parqueadero']).snapshotChanges().pipe(
      map((options: Array<any>) => {
        return options.map(option => ({ ...option.payload.doc.data(), key: option.payload.doc.id }))
      })
    ).subscribe(respuesta => {
      if (respuesta.length === 1 && respuesta[0].documento === valor) {
        this.formRegisterIncome.get('nombreUsuario').setValue(respuesta[0].nombre);
        this.formRegisterIncome.get('documentoUsuario').setValue(respuesta[0].documento);
      } else {
        const referencia = this.dialogComponent.open(ModalUserComponent, {
          data: {
            tipo: (respuesta.length ? 'listar' : 'crear'),
            datos: respuesta,
            parqueadero: this.dataUser['parqueadero']
          },
          maxWidth: (respuesta.length ? 700 : 400),
          disableClose: true
        });
        referencia.afterClosed().subscribe(resultado => {
          console.log("resultado ", resultado);
          if (resultado && resultado.nombre) {
            this.formRegisterIncome.get('nombreUsuario').setValue(resultado.nombre);
            this.formRegisterIncome.get('documentoUsuario').setValue(resultado.documento);
          }
        });
      }
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
