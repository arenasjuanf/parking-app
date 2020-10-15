import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  //inputs y outputs
  @Input('datosPlano') datosPlano : any;
  @Input('pisoSeleccionado') pisoSeleccionado: number;
  @Output()
  cambiarPiso = new EventEmitter<number>();
  
  constructor(
  ) {
    
  }

  ngOnInit(): void {
  }

  // se implementa para que escuche los cambios de los @input
  ngOnChanges(){
  }

  // true: over, false: out
  changeStyle(evento, piso, fila, columna) {
    let casilla = this.datosPlano[piso][fila][columna];
    casilla['over'] = evento;
  }

  seleccionarPisoTab(valor){
    this.pisoSeleccionado = valor;
    this.cambiarPiso.emit(valor);

  }

}
