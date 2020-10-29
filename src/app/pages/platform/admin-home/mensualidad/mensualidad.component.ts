import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ModalSuscripcionesComponent } from './modal-suscripciones/modal-suscripciones.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensualidad',
  templateUrl: './mensualidad.component.html',
  styleUrls: ['./mensualidad.component.scss']
})
export class MensualidadComponent implements OnInit, AfterViewInit  {

  usuarios: any[];
  suscripciones: any[];
  vehiculos: any[];
  displayedColumns: string[] = ['documento','cliente' ,'placa', 'marca', 'tipo', 'fechaInicio', 'fechaFinal', 'valor', 'acciones'];
  dataSource: MatTableDataSource<any>;

  predicadoBusqueda = (data, filter:string) => {
    return data['usuario']['documento'].trim().toLowerCase().indexOf(filter) != -1 ||
      data['usuario']['nombre'].trim().toLowerCase().indexOf(filter) != -1 ||
      data['vehiculo']['placa'].trim().toLowerCase().indexOf(filter) != -1 ||
      data['vehiculo']['marca'].trim().toLowerCase().indexOf(filter) != -1 ||
      data['fechaInicio'].trim().toLowerCase().indexOf(filter) != -1 ||
      data['fechaFinal'].trim().toLowerCase().indexOf(filter) != -1 

  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  constructor(
    public dialog: MatDialog,
    private db: DatabaseService, 
    private auth: AuthService,
    public afs: AngularFirestore,
    private router: Router
  ) {
    this.getSubscripciones$();
    this.getVehiculos$();
    this.getUsuarios$();

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
  }

  abrirModal(){
    this.dialog.open(ModalSuscripcionesComponent, {
      data: {},
    });
  }

  // tslint:disable-next-line: align
  getSubscripciones$(){
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    this.db.getPorFiltro('suscripciones', 'parqueadero', idParqueadero).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(suscr => ({ 
          ...suscr.payload.doc.data(),
          key: suscr.payload.doc.id , 
          fechaInicio: this.calcularfecha(suscr.payload.doc.data().fechaInicio.seconds),
          fechaFinal: this.calcularfecha(suscr.payload.doc.data().fechaFinal.seconds),
        }));
      })
    ).subscribe(r => {
      this.suscripciones = r;
      this.validardatos();
    });
  }

  getVehiculos$(){
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    return this.db.getPorFiltro('vehiculos', 'parqueadero', idParqueadero).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(user => ({ ...user.payload.doc.data(), key: user.payload.doc.id }));
      })
    ).subscribe(r => {
      this.vehiculos = r;
      this.validardatos();
    });
  }

  getUsuarios$() {
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    return this.db.getPorFiltro('usuarios', 'parqueadero', idParqueadero).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(user => ({ ...user.payload.doc.data(), key: user.payload.doc.id }));
      })
    ).subscribe(r => {
      this.usuarios = r;
      this.validardatos();
   });
  }

  validardatos(){
    if(this.usuarios && this.suscripciones && this.vehiculos){
      this.ordenarData();
    }
  }

  ordenarData(){

    this.suscripciones.forEach(suscripcion => {

      const posVh = this.vehiculos.findIndex(vh => {
        return vh.key === suscripcion.vehiculo;
      });

      if(posVh !== -1){
        suscripcion['vehiculo'] = this.vehiculos[posVh];

        const posUsr = this.usuarios.findIndex(usr => {
          return usr.key === this.vehiculos[posVh]['usuario'];
        });

        if (posUsr !== -1) {
          suscripcion['usuario'] = this.usuarios[posUsr];
        }
      }

    });
    this.dataSource = new MatTableDataSource(this.suscripciones);
    this.dataSource.filterPredicate = this.predicadoBusqueda;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  calcularfecha(fechaEnSegundos: number){

    if(!fechaEnSegundos){
      return '---'
    }

    return moment(new Date(fechaEnSegundos * 1000)).locale('es').format('l');
  }


  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  regresar() {
    this.router.navigateByUrl('/platform/admin/main');
  }

}
