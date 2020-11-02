import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { ModalUserComponent } from '../../register-income/modal-user/modal-user.component';
import { SuscripcionesComponent } from '../../register-income/suscripciones/suscripciones.component';
import { VehiculosComponent } from '../../register-income/vehiculos/vehiculos.component';

@Component({
  selector: 'app-modal-suscripciones',
  templateUrl: './modal-suscripciones.component.html',
  styleUrls: ['./modal-suscripciones.component.scss']
})
export class ModalSuscripcionesComponent implements OnInit {

  formCliente: FormGroup;
  formVehiculo: FormGroup;
  dataUser: any;
  userValidData: object;
  validUser: boolean = false;
  datosCliente: any;
  datosVehiculo: any;
  datosSuscripcion: any;
  modalAbierta: boolean = false;
  nombreParqueadero: string = '';
  branchVehicles: Array<object> = constantes.branchVehicles;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService, 
    public dialog: MatDialog ,
    private db: DatabaseService
  ) {
    this.dataUser = this.authService.datosUsuario;
    this.initForms();
    this.getDataParqueadero();
  }

  getDataParqueadero() {
    const idParqueadero = this.authService.datosUsuario.parqueadero;
    this.db.findDoc('parqueaderos', idParqueadero).snapshotChanges().subscribe(result => {
      this.nombreParqueadero = result.payload.get('razonSocial');
    });
  }

  ngOnInit(): void {
  }

  initForms(){
    this.formCliente = this.formBuilder.group({
      documentoUsuario: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      parqueadero: [this.dataUser['parqueadero'], Validators.required]
    });

    this.formVehiculo = this.formBuilder.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      tipoVehiculo: ['', Validators.required],
    });

    this.formVehiculo.disable();
    this.formCliente.get('nombreUsuario').disable();
  }

  searchDataUser(evento?) {
    if (!this.validUser) {
      let valor = evento ? evento.srcElement.value : this.formCliente.get('documentoUsuario').value;
      this.db.getPorFiltro("usuarios", 'parqueadero', this.dataUser['parqueadero'])
        .ref.orderBy('documento').startAt(valor).endAt(valor + '\uf8ff')
        .onSnapshot(respuesta => {

          const datos = respuesta.docs.map(item => ({
            ...item.data(), key: item.id
          }));

          if (this.validUser || (datos.length === 1 && datos[0]['documento'] === valor)) {
            this.setValueData(this.validUser ? this.userValidData : datos[0]);
            this.buscarVehiculo(datos[0].key);

          } else {
            const referencia = this.dialog.open(ModalUserComponent, {
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
              if (resultado) {
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
      this.dialog.open(ModalUserComponent, {
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

        if (resultado) {
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
    this.formCliente.get('nombreUsuario').setValue(resultado.nombre);
    this.formCliente.get('documentoUsuario').setValue(resultado.documento);

  }

  setValueVehicle(resultado) {
    this.datosVehiculo = resultado;
    this.buscarSuscripciones();
    this.formVehiculo.get('placa').setValue(resultado.placa);
    this.formVehiculo.get('tipoVehiculo').setValue(resultado.tipo);
    this.formVehiculo.get('marca').setValue(resultado.marca);
  }

  buscarSuscripciones() {
    const data = Object.assign({}, { datosVehiculo: this.datosVehiculo, datosCliente: this.datosCliente })
    data['soloMostrar'] = true;

    this.dialog.open(SuscripcionesComponent, {
      data,
      height: '500px',
      width: '400px',
      disableClose: true
    }).afterClosed().subscribe(datos => {
      if (datos) {
        this.setValueSuscripcion(datos);
      } else {
        this.datosSuscripcion = null;
      }
    });
  }

  setValueSuscripcion(resultado) {
    this.datosSuscripcion = resultado;
  }

  buscarVehiculo(idUsuario: string) {
    this.db.getPorFiltro('vehiculos', 'usuario', idUsuario).snapshotChanges().subscribe(respuesta => {
      const datos = respuesta.map(item => {
        let x = item.payload.doc.data();
        x['key'] = item.payload.doc.id;
        return x;
      });

      if (datos.length == 1) {
        this.setValueVehicle(datos[0]);
      } else {
        this.verVehiculos();
      }

    }, error => {
      console.log("Error ", error);
    });
  }

  verVehiculos(seleccionar = false) {

    const data = Object.assign({}, this.datosCliente)
    data['seleccionar'] = seleccionar;
    if (!this.modalAbierta) {

      const ref = this.dialog.open(VehiculosComponent, {
        data,
        height: '500px',
        width: '400px',
        disableClose: true
      })

      ref.afterOpened().subscribe(x => {
        this.modalAbierta = true;
      })

      ref.afterClosed().subscribe(result => {
        this.modalAbierta = false;
        if (result) {
          this.setValueVehicle(result);
          console.log('result: ', result);
        }
      });
    }
  }

  reset(){
    this.datosCliente = null;
    this.datosVehiculo = null;
    this.userValidData = null;
    this.validUser = false;
    this.formCliente.reset();
    this.formVehiculo.reset();
    this.datosSuscripcion = null;
    this.formCliente.get('parqueadero').setValue(this.dataUser['parqueadero'])
  }

}
