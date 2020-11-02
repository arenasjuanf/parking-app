import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GestionParqueaderoComponent } from '../gestion-parqueadero/gestion-parqueadero.component';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from '../../services/notification.service';
import { timer } from 'rxjs';
import { constantes } from 'src/app/constantes';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'app-parqueaderos',
  templateUrl: './parqueaderos.component.html',
  styleUrls: ['./parqueaderos.component.scss']
})
export class ParqueaderosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['logo', 'documento', 'nombre', 'telefono', 'acciones'];
  dataSource: MatTableDataSource<any>;
  // tslint:disable-next-line: max-line-length
  configLoader = constantes.coloresLoader;
  listaParqueaderos: object[];
  isTrue = true;
  subs: any;
  cargando: boolean = false;

  constructor(
    public dialog: MatDialog,
    private dbService: DatabaseService,
    public auth: AuthService,
    private notificationService: NotificationService,
  ) {
    this.getParqueaderos();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
  }

  abrirModal(datos?, accion = 'crear') {
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

  getParqueaderos() {
    this.cargando = true;
    this.dbService.getData('parqueaderos').pipe(
      map((x: any[]) => {
        return x.map(park => ({ ...park.payload.doc.data(), key: park.payload.doc.id }));
      })
    ).subscribe(result => {
      result = result.map(park => {
        park.plano = JSON.parse(park.plano);
        return park;
      });
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.cargando = false;
    });
  }

  cambiarEstado(elemento) {
    this.dbService.modificar('parqueaderos', elemento.key, { estado: elemento.estado ? false : true }).then(respuesta => {
      this.notificationService.notification("success", "Estado modificado correctamente");
    }, error => {
      this.notificationService.notification("error", "Error al cambiar estado");
    });
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
