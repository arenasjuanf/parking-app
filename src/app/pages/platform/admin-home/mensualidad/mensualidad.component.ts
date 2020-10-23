import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalSuscripcionesComponent } from './modal-suscripciones/modal-suscripciones.component';

@Component({
  selector: 'app-mensualidad',
  templateUrl: './mensualidad.component.html',
  styleUrls: ['./mensualidad.component.scss']
})
export class MensualidadComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  abrirModal(){
    this.dialog.open(ModalSuscripcionesComponent, {
      data: {},
     
    })
  }

}
