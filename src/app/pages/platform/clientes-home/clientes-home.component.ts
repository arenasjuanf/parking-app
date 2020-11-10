import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-clientes-home',
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss']
})
export class ClientesHomeComponent implements OnInit {

  opened: boolean = false;
  datosParqueadero: any;
  constructor(private auth: AuthService) {
    console.log(this.auth.datosUsuario);
  }

  ngOnInit(): void {
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }

  ir(ruta) { }

}
