import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ModalUsuariosComponent } from './modal-usuarios/modal-usuarios.component';
import { PermisosComponent } from './permisos/permisos.component';
import { NotificationService } from '../../services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[];
  formulario: any;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['documento', 'nombre', 'telefono', 'acciones'];

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    public dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.getUsers();
  }

  ngOnInit(): void {
  }


  getUsers() {
    const idParqueadero = this.auth.datosUsuario.parqueadero;

    this.db.afs.collection(`/usuarios`, ref => ref.where('parqueadero', '==', idParqueadero).where('tipoUsuario', '==', 'admin')
    ).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(user => ({ ...user.payload.doc.data(), key: user.payload.doc.id }));
      })
    ).subscribe(datos => {

      console.log(datos);
      this.dataSource = new MatTableDataSource(datos);
      this.usuarios = datos;
    });
  }

  abrirModal(datos?) {

    const dialogRef = this.dialog.open(ModalUsuariosComponent, {
      data: datos,
      width: '700px',
      disableClose: true
    });
  }

  volver() {
    this.router.navigateByUrl('/platform/admin/main');
  }

  cambiarEstado(user) {
    const estado = !user.estado;
    this.db.modificar('usuarios', user.key, { estado }).then(respuesta => {
      this.notificationService.notification("success", "Se ha actualizado el estado");
    }, error => {
      this.notificationService.notification("error", "No fue posible actualizar el estado");
    });
  }

  permisos(usuario) {
    console.log(usuario);
    const datos = {
      width: '300px',
      disableClose: true
    };
    if (usuario.permisos) {
      datos['data'] = usuario.permisos;
    }

    this.dialog.open(PermisosComponent, datos).afterClosed().subscribe(permisos => {
      if (permisos) {
        console.log('result: ', permisos);
        this.db.modificar('usuarios', usuario.key, { permisos }).then(result => {
          console.log('reusltado modificaicon; ', result);
          this.notificationService.notification("success", "Permisos guardados correctamente");
        }, error => {
          this.notificationService.notification("error", "No fue posible guardar los cambios");
        });
      }
    });
  }

  cambiarClave(usuario){
    this.auth.recuperarClave(usuario.email).then( result => {
      console.log({result})
    })
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
