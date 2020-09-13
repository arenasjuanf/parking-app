import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GestionParqueaderoComponent } from '../gestion-parqueadero/gestion-parqueadero.component';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-parqueaderos',
  templateUrl: './parqueaderos.component.html',
  styleUrls: ['./parqueaderos.component.scss']
})
export class ParqueaderosComponent implements OnInit {

  listaParqueaderos: object[];

  constructor(
    public dialog: MatDialog,
    private dbService: DatabaseService,
    public auth: AuthService)
  {
    this.getParqueaderos();
  }

  ngOnInit(): void {
  }

  abrirModal(datos?, accion = 'crear'){
    console.log(datos);
    const data = datos ? datos : {};
    data['accion'] = accion;
    const parametros = {
      data,
      maxWidth: 900,
      maxHeight: 700,
      disableClose: true
    };

    this.dialog.open(GestionParqueaderoComponent, parametros);
  }

  getParqueaderos(){
    this.dbService.getData('parqueaderos').pipe(
      map((x:any[]) => {
        return x.map(park => ({  ...park.payload.doc.data(), key: park.payload.doc.id }));
      })
    ).subscribe(result =>{
      this.listaParqueaderos = result;
    });
  }

  cambiarEstado(elemento){
    this.dbService.modificar('parqueaderos', elemento.key, { habilitado: elemento.habilitado ? false : true })
  }

}
