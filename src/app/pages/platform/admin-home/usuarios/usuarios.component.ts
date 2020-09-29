import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ModalUsuariosComponent } from './modal-usuarios/modal-usuarios.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[];

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    public dialog: MatDialog)
  {
    this.getUsers();
  }

  ngOnInit(): void {
  }


  getUsers(){
    const idParqueadero = this.auth.datosUsuario.parqueadero;

    this.db.afs.collection(`/usuarios`, ref => ref.where('parqueadero', '==', idParqueadero).where('tipoUsuario', '==', 'admin')
    ).valueChanges().subscribe(datos => {
      this.usuarios = datos;
      console.log(this.usuarios);
    });
  }

  abrirModal(datos?){

    const dialogRef = this.dialog.open(ModalUsuariosComponent,{
      data: datos,
      width: '700px',
      height: '400px',
      disableClose: true
    });

  }

}
