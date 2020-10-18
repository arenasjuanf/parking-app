import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { MatSelectChange } from '@angular/material/select';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.scss']
})
export class RegisterIncomeComponent implements OnInit {
  pisoSeleccionado: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataBaseService: DatabaseService,
    public dialogComponent: MatDialog,
  ) {
    this.dataUser = this.authService.datosUsuario;
    this.getPlano();
    this.getFloorsParking();
  }

  formRegisterIncome: FormGroup;
  branchVehicles: Array<object> = [{ value: 'moto', view: 'Moto' }, { value: 'carro', view: 'Carro' }];
  dataUser;
  floorsParking;
  userValidData: object;
  validUser: Boolean = false;
  datosPlano = [];

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
      //seccionPiso: ['', Validators.required],
      parqueadero: [this.dataUser['parqueadero'], Validators.required]
    });

    /* Object.keys(this.formRegisterIncome.value).forEach(elem => {
      if (elem !== 'documentoUsuario'){
        this.formRegisterIncome.get(elem).disable();
      }
    }); */

    this.validarEstadoFormulario();
    this.permitirAsignar();
  }

  getFloorsParking() {
    this.dataBaseService.findDoc("parqueaderos", this.dataUser['parqueadero']).snapshotChanges().subscribe(respuesta => {
      this.floorsParking = respuesta.payload.get('pisos');
    }, error => {
      console.log("Error ", error);
    });
  }

  getPlano() {
    this.dataBaseService.findDoc("parqueaderos", this.dataUser['parqueadero']).snapshotChanges().subscribe(respuesta => {
      this.datosPlano = JSON.parse(respuesta.payload.get('plano'));
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
      console.log('Formulario ', this.formRegisterIncome.value);
    } else {
      this.formRegisterIncome.markAsTouched();
    }
  }

  cambiarPisosSelect(event: MatSelectChange ){
    this.pisoSeleccionado = event.value - 1 ;
  }

  cambiarPiso(valor){
    this.pisoSeleccionado = valor;
    this.formRegisterIncome.get('piso').setValue(valor+1);
  }

  reset(){
    this.validUser = false;
    this.formRegisterIncome.reset();
  }

  validarEstadoFormulario(){
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

  permitirAsignar(){
    this.formRegisterIncome.valueChanges.subscribe(valor => {
      console.log(this.formRegisterIncome);
      if(this.formRegisterIncome.valid){
        console.log('valid')
      }
    });
  }


}
