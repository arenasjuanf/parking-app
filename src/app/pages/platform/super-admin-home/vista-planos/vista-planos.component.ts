import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vista-planos',
  templateUrl: './vista-planos.component.html',
  styleUrls: ['./vista-planos.component.scss']
})
export class VistaPlanosComponent implements OnInit {
  actualTool: string;
  default = { tipo: '', numero: ''};
  color = '#C7C8D3';
  numero = 1;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VistaPlanosComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  elegirHerramienta(evento){
    if(evento.value){
      this.actualTool = evento.value;
      let cursor = 'auto';
      switch (this.actualTool) {
        case 'carro':
          cursor = 'crosshair';
          break;
        case 'moto':
          cursor = 'crosshair';
          break;
        case 'pintar':
          break;
        case 'borrar':
          cursor = 'cell';
          break;
      }
      document.body.style.cursor = cursor;
    }
  }

  resetCursor(){
    document.body.style.cursor = 'auto';
  }

  gestionar(piso, fila, columna){
    //console.log({piso,fila,columna});
    let casilla = this.data.plano[piso][fila][columna];
    switch (this.actualTool) {
      case 'carro':
        casilla['tipo'] = this.actualTool;
        break;
      case 'moto':
        casilla['tipo'] = this.actualTool;
        break;
      case 'pintar':
        casilla['color'] = this.color;
        break; 
      case 'numero':
        casilla['numero'] = this.numero;
        this.numero++;
        break;
      case 'borrar':
        this.data.plano[piso][fila][columna] = Object.assign({}, this.default);
        break;
    }

  }

}
