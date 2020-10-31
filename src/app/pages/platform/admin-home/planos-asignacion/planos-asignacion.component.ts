import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-planos-asignacion',
  templateUrl: './planos-asignacion.component.html',
  styleUrls: ['./planos-asignacion.component.scss']
})
export class PlanosAsignacionComponent implements OnInit, OnChanges{
  actualTool: string;
  default = { tipo: '', numero: ''};
  color = '#C7C8D3';
  numero = 1;
  data: any = {};


  // tslint:disable-next-line: no-input-rename
  @Input('datosPlano') datosPlano : any;
  // tslint:disable-next-line: no-input-rename
  @Input('pisoSeleccionado') pisoSeleccionado: number;
  // tslint:disable-next-line: no-input-rename

  // tslint:disable-next-line: ban-types
  // tslint:disable-next-line: no-input-rename
  @Input('asignar') asignar: Boolean;

  @Output()
  cambiarPiso = new EventEmitter<number>();

  @Output()
  enviarCasilla = new EventEmitter<any>();


  constructor(private notificationService: NotificationService, private db: DatabaseService) {}

  ngOnInit(): void {
  }

  // se implementa para que escuche los cambios de los @input
  ngOnChanges(){

    if(this.datosPlano){
      this.buscarSuscripciones();
    }

  }

  // true: over, false: out
  changeStyle(evento, piso, fila, columna) {
    const casilla = this.datosPlano[piso][fila][columna];
    casilla['over'] = evento;
  }

  seleccionarPisoTab(valor){
    this.pisoSeleccionado = valor;
    this.cambiarPiso.emit(valor);
  }


  asignarCasilla(piso,fila,columna){
    const casilla =  this.datosPlano[piso][fila][columna];
    if(!this.asignar){
      this.notificationService.notification("error", "Debe llenar los datos para poder asignar casila");
      return 0;
    }

    if (casilla.tipo){
      this.enviarCasilla.emit({piso,fila,columna})
    } else {
      this.notificationService.notification("error", "No se puede asignar a esta casilla");

    }
  }

  buscarSuscripciones(){
    this.datosPlano.forEach(piso => {
      piso.forEach(col => {
        col.forEach( casilla => {
          if(casilla.suscripcion){
            casilla['placa'] = casilla.suscripcion.vehiculo.placa;
          }
        });
      });
    });
  }


}
