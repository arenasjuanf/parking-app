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
import { Router } from '@angular/router';
import { SuscripcionesComponent } from './suscripciones/suscripciones.component';
import { NotificationService } from '../../services/notification.service';
import { EgresoComponent } from './egreso/egreso.component';
import { constantes } from 'src/app/constantes';

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
  datosSuscripcion: any;
  modalAbierta: boolean = false;
  mostrarEgreso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataBaseService: DatabaseService,
    public dialogComponent: MatDialog,
    private router: Router,
    private notify: NotificationService
  ) {
    this.dataUser = this.authService.datosUsuario;
    this.getPlano();
    this.getFloorsParking();
  }

  formRegisterIncome: FormGroup;
  formVehiculo: FormGroup;
  branchVehicles: Array<object> = constantes.branchVehicles;
  dataUser;
  floorsParking;
  userValidData: object;
  validUser: boolean = false;
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
    this.buscarSuscripciones();
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
    if (this.datosCliente && this.datosVehiculo && this.datosSuscripcion) {
      this.asignar = true;
    } else {
      this.asignar = false;
    }
  }

  asignarCasilla(evento, idlog){

    // tslint:disable-next-line: max-line-length
    this.datosPlano[evento.piso][evento.fila][evento.columna]['suscripcion'] = { suscripcion: this.datosSuscripcion.key, vehiculo: this.datosVehiculo, idlog };
    this.dataBaseService.modificar('parqueaderos', this.dataUser['parqueadero'] , {plano :JSON.stringify(this.datosPlano)}).then(x => {
      this.notify.notification('success', 'Suscripción creada');
      this.reset();
    }).catch(err => {
      this.notify.notification('error', 'Error al asignar casilla');
    })

  }

  guardarRegistro(evento){

    //puesto, terminar ?: boolean
    const registroLog: any = {
      parqueadero: this.dataUser['parqueadero'],
      suscripcion: this.datosSuscripcion['key'],
      datosSuscripcion: this.datosSuscripcion,
      cliente: this.datosCliente['key'],
      datosCliente: this.datosCliente,
      vehiculo: this.datosVehiculo['key'],
      datosVehiculo: this.datosVehiculo,
      usuarioEntrada: this.dataUser['nombre'],
      fechaEntrada: new Date(),
      puesto: evento
    };

    this.dataBaseService.addData('logs', registroLog).then(result => {

      if(result){
        const idLog = result.id;
        this.asignarCasilla(evento, idLog);
      }

    }).catch(error => {
      console.log({ error });
      this.notify.notification('error', 'Error al crear suscripción');
    })

  }

  buscarVehiculo(idUsuario: string){
    this.dataBaseService.getPorFiltro('vehiculos', 'usuario', idUsuario).snapshotChanges().subscribe(respuesta => {
      const datos = respuesta.map(item => {
        let x = item.payload.doc.data();
        x['key'] = item.payload.doc.id;
        return x;
      });
      debugger;
      if(datos.length == 1){
        this.setValueVehicle(datos[0]);
      }else{
        this.verVehiculos();
      }

    }, error => {
      console.log("Error ", error);
    });
  }

  verVehiculos(seleccionar = false){

    const data = Object.assign({}, this.datosCliente)
    data['seleccionar'] = seleccionar;
    if(!this.modalAbierta){

      const ref = this.dialogComponent.open(VehiculosComponent, {
        data,
        height: '500px',
        width: '400px',
        disableClose: true
      })

      ref.afterOpened().subscribe(x=> {
        this.modalAbierta = true;
      })

      ref.afterClosed().subscribe(result => {
        this.modalAbierta = false;
        if (result) {
          this.setValueVehicle(result);
        }
      });
    }
  }

  regresar() {
    this.router.navigateByUrl('/platform/admin/main');
  }

  reset(){
    this.asignar = false;
    this.datosCliente = null;
    this.datosVehiculo = null;
    this.userValidData = null;
    this.validUser = false;
    this.formRegisterIncome.reset();
    this.formVehiculo.reset();
    this.datosSuscripcion = null;
    this.formRegisterIncome.get('parqueadero').setValue(this.dataUser['parqueadero'])
  }

  buscarSuscripciones(){
    const data = Object.assign({}, { datosVehiculo: this.datosVehiculo, datosCliente: this.datosCliente})

    this.dialogComponent.open(SuscripcionesComponent, {
      data,
      height: '500px',
      width: '400px',
      disableClose: true
    }).afterClosed().subscribe(datos => {
      if ( datos ) {
        this.setValueSuscripcion(datos);
      } else {
        this.datosSuscripcion = null;
      }
    });
  }

  setValueSuscripcion(resultado) {
    this.datosSuscripcion = resultado;
    this.permitirAsignar();
  }

  buscarPlaca(placaVehiculo: string){

    let datos: {casilla: object, suscripcion: any};
    // tslint:disable-next-line: forin
    for(const piso in this.datosPlano){
      // tslint:disable-next-line: forin
      for (const fila in this.datosPlano[piso]){
        // tslint:disable-next-line: forin
        for (const casilla in this.datosPlano[piso][fila]){
          const puesto = this.datosPlano[piso][fila][casilla];
          if (puesto.suscripcion) {
            const suscripcion = puesto.suscripcion;
            if (suscripcion.vehiculo.placa.toLowerCase() === placaVehiculo.toLowerCase() ) {
              datos = {
                casilla: {piso, fila , casilla},
                suscripcion
              };
              break;
            }
          }
        }
        if (datos) {
          break;
        }
      }
      if (datos) {
        break;
      }
    }

    if(datos){
      const referencia = this.dialogComponent.open(EgresoComponent, {
        data: datos,
        disableClose: true,
        restoreFocus: false,
        height: '700px',
        width: '500px'
      }).afterClosed().subscribe((cerrar: {cerrar: boolean, valor: number}) => {
        if(cerrar.cerrar){
          this.vaciarCasilla(datos.casilla, datos.suscripcion.idlog, cerrar.valor);
        }
      });
    }
  }


  vaciarCasilla(puesto, idLog, valor){

    delete this.datosPlano[puesto.piso][puesto.fila][puesto.casilla]['suscripcion'];
    delete this.datosPlano[puesto.piso][puesto.fila][puesto.casilla]['placa'];
    this.dataBaseService.modificar(
      'parqueaderos',
      this.dataUser['parqueadero'], 
      { plano: JSON.stringify(this.datosPlano) }
    ).then(x => {
      this.notify.notification('success', 'Egreso Exitoso');
      this.cerrarLog(idLog, valor);
    });

  }

  cerrarLog(idLog, valor){
    const data = {
      fechaSalida: new Date(),
      usuarioSalida :this.dataUser['nombre'],
      valor
    };
    this.dataBaseService.modificar('logs',idLog, data).then( x => {
      this.notify.notification('success', 'Registro Guardado')
    });
  }

}
