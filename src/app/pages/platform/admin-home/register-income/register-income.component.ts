import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { MatSelectChange } from '@angular/material/select';
import { IfStmt } from '@angular/compiler';
import { VehiculosComponent } from './vehiculos/vehiculos.component';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.scss']
})
export class RegisterIncomeComponent implements OnInit {
  pisoSeleccionado: number = 0;
  asignar: boolean = false;
  datosCliente: any;
  datosVehiculo: any;

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
  formVehiculo: FormGroup;
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
      piso: ['', Validators.required],
      parqueadero: [this.dataUser['parqueadero'], Validators.required]
    });


    this.formVehiculo = this.formBuilder.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      tipoVehiculo: ['', Validators.required],
    });

    this.formVehiculo.disable();
    this.formRegisterIncome.get('nombreUsuario').disable();

    this.validarEstadoFormulario();
  }

  getFloorsParking() {
    this.dataBaseService.findDoc('parqueaderos', this.dataUser['parqueadero']).snapshotChanges().subscribe(respuesta => {
      this.floorsParking = respuesta.payload.get('pisos');
    }, error => {
      console.log("Error ", error);
    });
  }

  getPlano() {
    this.dataBaseService.findDoc('parqueaderos', this.dataUser['parqueadero']).snapshotChanges().subscribe(respuesta => {
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
            this.buscarVehiculo(datos[0].key);

          } else {
            const referencia = this.dialogComponent.open(ModalUserComponent, {
              data: {
                tipo: (datos.length ? 'listar' : 'crear'),
                datos,
                parqueadero: this.dataUser['parqueadero'],
                documento: valor
              },
              disableClose: true,
              restoreFocus: false,
              height: '500px',
              width: '700px'
            });
            referencia.afterClosed().subscribe(resultado => {
              if ( resultado ) {
                if (resultado.datosUsuario) {
                  this.setValueData(resultado.datosUsuario);
                }

                if (resultado.datosVehiculo) {
                  this.setValueVehicle(resultado.datosVehiculo);
                }

              }
            });
          }
        }, error => {
          console.log("Error ", error);
        });
    } else {
      this.dialogComponent.open(ModalUserComponent, {
        data: {
          tipo: 'crear',
          datos: this.userValidData,
          parqueadero: this.dataUser['parqueadero'],
          editarUsuario: true,
        },
        disableClose: true,
        height: '500px',
        width: '700px'
      }).afterClosed().subscribe(resultado => {

        if (resultado){
          if (resultado.datosUsuario) {
            this.setValueData(resultado.datosUsuario);
          }

          if (resultado.datosVehiculo) {
            this.setValueVehicle(resultado.datosVehiculo);
          }

        }
        

      });
    }
  }

  setValueData(resultado) {
    this.datosCliente = resultado;
    this.userValidData = resultado;
    this.formRegisterIncome.get('nombreUsuario').setValue(resultado.nombre);
    this.formRegisterIncome.get('documentoUsuario').setValue(resultado.documento);
    this.permitirAsignar();
  }

  setValueVehicle(resultado) {
    this.datosVehiculo = resultado;
    this.formVehiculo.get('placa').setValue(resultado.placa);
    this.formVehiculo.get('tipoVehiculo').setValue(resultado.tipo);
    this.formVehiculo.get('marca').setValue(resultado.marca);
    this.permitirAsignar();
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
    this.formRegisterIncome.get('parqueadero').setValue(this.dataUser['parqueadero'])
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
    if (this.datosCliente && this.datosVehiculo) {
      this.asignar = true;
    } else {
      this.asignar = false;
    }
  }

  asignarCasilla(evento){

    this.datosPlano[evento.piso][evento.fila][evento.columna]['cliente']= this.formRegisterIncome.get('placa').value;
    this.dataBaseService.modificar('parqueaderos', this.dataUser['parqueadero'] , {plano :JSON.stringify(this.datosPlano)})
    console.log(evento);
  }

  buscarVehiculo(idUsuario:string){
    this.dataBaseService.getPorFiltro('vehiculos', 'usuario', idUsuario).snapshotChanges().subscribe(respuesta => {
      const datos = respuesta.map(item => {
        let x = item.payload.doc.data();
        x['key'] = item.payload.doc.id;
        return x;
      });

      if(datos.length == 1){
        this.setValueVehicle(datos[0]);
      }

    }, error => {
      console.log("Error ", error);
    });
  }


  verVehiculos(){

    console.log(this.datosCliente)
    this.dialogComponent.open(VehiculosComponent,{
      data: this.datosCliente,
      height: '700px',
      width: '500px'
    }).afterClosed().subscribe( result => {
      console.log('result: ', result)
    });
  }

}
