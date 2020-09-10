import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vista-planos',
  templateUrl: './vista-planos.component.html',
  styleUrls: ['./vista-planos.component.scss']
})
export class VistaPlanosComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VistaPlanosComponent>,
  ) {
    this.data.forEach(piso => {
      let puestos = [];
      if(!piso.motos && piso.carros){
        puestos = piso.carros;
      } else if (!piso.carros && piso.motos){
        puestos = piso.motos;
      }else{
        puestos = piso.carros.concat(piso.motos);
      }
      piso.puestos = puestos;
    });
    console.log(this.data);
  }

  ngOnInit(): void {
  }

}
