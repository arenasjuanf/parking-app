import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';

@Component({
  selector: 'app-historial-usuarios',
  templateUrl: './historial-usuarios.component.html',
  styleUrls: ['./historial-usuarios.component.css']
})
export class HistorialUsuariosComponent implements OnInit {

  listUsers: Array<object> = [];
  cargando: boolean = false;
  configLoader = constantes.coloresLoader;


  constructor(private dbService: DatabaseService) {
    this.getUsuarios();
  }

  ngOnInit(): void { }

  getUsuarios() {
    this.cargando = true;
    this.dbService.getData("usuarios").pipe(
      map((x: any[]) => {
        return x.map(park => ({  ...park.payload.doc.data(), key: park.payload.doc.id }));
      })
    ).subscribe(usuarios => {
      this.listUsers = usuarios;
      this.cargando = false;
    }, error => {
      this.cargando = false;
      console.log("Error ", error);
    });
  }

}
