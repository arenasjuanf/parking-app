import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-historial-usuarios',
  templateUrl: './historial-usuarios.component.html',
  styleUrls: ['./historial-usuarios.component.css']
})
export class HistorialUsuariosComponent implements OnInit {

  listUsers: Array<object> = [];

  constructor(private dbService: DatabaseService,) {
    this.getUsuarios();
  }

  ngOnInit(): void { }

  getUsuarios() {
    this.dbService.getData("usuarios").pipe(
      map((x: any[]) => {
        return x.map(park => ({ ...park.payload.val() }));
      })
    ).subscribe(usuarios => {
      this.listUsers = usuarios;
      console.log("Usuarios user ", usuarios);
    }, error => {
      console.log("Error ", error);
    });
  }

}
