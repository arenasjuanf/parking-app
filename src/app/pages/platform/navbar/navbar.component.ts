import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PerfilComponent } from '../super-admin-home/perfil/perfil.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario: any;

  constructor(public auth: AuthService, private router: Router, public dialog: MatDialog) { 
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
  }

  logout() {
    this.auth.cerrarSesion();
  }

  ngOnInit(): void {
  }

  editarPerfil() {
    this.dialog.open(PerfilComponent, {
      data: {},
      height: '500px',
      width: '600px',
      disableClose: true,
    });
  }

}
