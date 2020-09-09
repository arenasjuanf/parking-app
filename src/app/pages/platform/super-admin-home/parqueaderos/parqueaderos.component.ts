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

  abrirModal(id?){
    const data = {};
    if(id){
      data[id] = id;
    }
    this.dialog.open(GestionParqueaderoComponent, {
      data,
      maxWidth: 700,
      maxHeight: 600
    });
  }

  getParqueaderos(){
    this.dbService.getData('parqueaderos').pipe(
      map((x:any[]) => {
        return x.map(park => ({  ...park.payload.val() }));
      })
    ).subscribe(result =>{
      this.listaParqueaderos = result;
    });
  }


}
