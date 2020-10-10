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
  userValidData: object;
  validUser: boolean = false;

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

    this.formRegisterIncome.get('documentoUsuario').valueChanges.subscribe(valor => {
      if (this.userValidData && (valor === this.userValidData['documento'])) {
        this.validUser = true;
        this.formRegisterIncome.get('nombreUsuario').setValue(this.userValidData['nombre']);
      } else {
        this.validUser = false;
        this.formRegisterIncome.get('nombreUsuario').reset();
      }
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
    if (!this.validUser) {
      let valor = evento ? evento.srcElement.value : this.formRegisterIncome.get('documentoUsuario').value;
      this.dataBaseService.getPorFiltro("usuarios", 'parqueadero', this.dataUser['parqueadero'])
        .ref.orderBy('documento').startAt(valor).endAt(valor + '\uf8ff')
        .onSnapshot(respuesta => {
          const datos = respuesta.docs.map(item => ({
            ...item.data(), key: item.id
          }));
          console.log("Usuario ", this.validUser, datos);
          if (this.validUser || (datos.length === 1 && datos[0]['documento'] === valor)) {
            this.setValueData(this.validUser ? this.userValidData : datos[0]);
          } else {
            const referencia = this.dialogComponent.open(ModalUserComponent, {
              data: {
                tipo: (datos.length ? 'listar' : 'crear'),
                datos: datos,
                parqueadero: this.dataUser['parqueadero'],
                documento: valor
              },
              disableClose: true
            });
            referencia.afterClosed().subscribe(resultado => {
              if (resultado && resultado.nombre) {
                this.setValueData(resultado);
              }
            });
          }
        }, error => {
          console.log("Error ", error);
        });
    } else {
      const referenciaEditar = this.dialogComponent.open(ModalUserComponent, {
        data: {
          tipo: 'crear',
          datos: this.userValidData,
          parqueadero: this.dataUser['parqueadero'],
          editarUsuario: true,
        },
        disableClose: true
      });
      referenciaEditar.afterClosed().subscribe(resultado => {
        if (resultado && resultado.nombre) {
          this.setValueData(resultado);
        }
      });
    }
  }

  setValueData(resultado) {
    this.userValidData = resultado;
    this.formRegisterIncome.get('nombreUsuario').setValue(resultado.nombre);
    this.formRegisterIncome.get('documentoUsuario').setValue(resultado.documento);
  }

  saveDataRegister() {
    if (this.formRegisterIncome.valid) {
      console.log("Formulario ", this.formRegisterIncome.value);
    } else {
      this.formRegisterIncome.markAsTouched();
    }
  }

}
