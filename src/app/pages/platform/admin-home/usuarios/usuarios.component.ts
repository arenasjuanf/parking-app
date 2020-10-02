import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';
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
  formulario: any;

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    public dialog: MatDialog,
    private router: Router)
  {
    this.getUsers();
  }

  ngOnInit(): void {
  }


  getUsers(){
    const idParqueadero = this.auth.datosUsuario.parqueadero;

    this.db.afs.collection(`/usuarios`, ref => ref.where('parqueadero', '==', idParqueadero).where('tipoUsuario', '==', 'admin')
    ).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(user => ({ ...user.payload.doc.data(), key: user.payload.doc.id }));
      })
    ).subscribe(datos => {
      this.usuarios = datos;
    });
  }

  abrirModal(datos?){

    const dialogRef = this.dialog.open(ModalUsuariosComponent,{
      data: datos,
      width: '700px',
      height: '450px',
      disableClose: true
    });
  }

  volver(){
    this.router.navigateByUrl('/platform/admin/main');
  }

  cambiarEstado(user){
    const estado = !user.estado;
    this.db.modificar('usuarios', user.key, {estado});
  }

}
