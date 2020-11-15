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
import { constantes } from 'src/app/constantes';
import { merge, Observable, zip } from 'rxjs';

@Component({
  selector: 'app-mensualidad',
  templateUrl: './mensualidad.component.html',
  styleUrls: ['./mensualidad.component.scss']
})
export class MensualidadComponent implements OnInit, AfterViewInit  {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  usuarios: any[];
  suscripciones: any[];
  vehiculos: any[];
  displayedColumns: string[] = ['documento','cliente' ,'placa', 'marca', 'tipo', 'fechaInicio', 'fechaFinal', 'valor', 'acciones'];
  dataSource: MatTableDataSource<any>;
  configLoader = constantes.coloresLoader;
  cargando: boolean = false;
  filtered: any[];
  fechaFinal:string = '';
  fechaInicio: string = '';

  predicadoBusqueda = (data, filter: string ) => {
    return data.usuario.documento.trim().toLowerCase().indexOf(filter) !== -1
    || data.usuario.nombre.trim().toLowerCase().indexOf(filter) !== -1
    || data.vehiculo.placa.trim().toLowerCase().indexOf(filter) !== -1
    || data.vehiculo.marca.trim().toLowerCase().indexOf(filter) !== -1
    || data.fechaInicio.trim().toLowerCase().indexOf(filter) !== -1
    || data.fechaFinal.trim().toLowerCase().indexOf(filter) !== -1;
  }

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
  }

  abrirModal(){
    this.dialog.open(ModalSuscripcionesComponent, {
      data: {},
    });
  }

  // tslint:disable-next-line: align
  getSubscripciones$(){
    this.cargando = true;
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    this.db.getPorFiltro('suscripciones', 'parqueadero', idParqueadero).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(suscr => ({ 
          ...suscr.payload.doc.data(),
          key: suscr.payload.doc.id , 
          fechaInicio: this.calcularfecha(suscr.payload.doc.data().fechaInicio.seconds),
          fechaFinal: this.calcularfecha(suscr.payload.doc.data().fechaFinal ? suscr.payload.doc.data().fechaFinal.seconds : 0),
        }));
      })
    ).subscribe(r => {
      this.suscripciones = r;
      this.filtered = r;
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

    const contains$: Observable<any> = this.afs.collection(`/usuarios`, ref =>
      ref.where('parqueadero', 'array-contains', idParqueadero)
    ).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(user => ({ ...user.payload.doc.data(), key: user.payload.doc.id }));
      })
    );

    const equal$: Observable<any> = this.db.getPorFiltro('usuarios', 'parqueadero', idParqueadero).snapshotChanges().pipe(
      map((x: any[]) => {
        return x.map(user => ({ ...user.payload.doc.data(), key: user.payload.doc.id }));
      })
    );

    zip(equal$, contains$).pipe(
      map(([equal, contains]) => [...equal, ...contains])
    ).subscribe((result: any[]) => {
      this.usuarios = result;
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
      console.log(suscripcion);
      const posVh = this.vehiculos.findIndex(vh => {
        return vh.key === suscripcion.vehiculo;
      });

      if(posVh !== -1){
        suscripcion.vehiculo = this.vehiculos[posVh];

        const posUsr = this.usuarios.findIndex(usr => {
          return usr.key === this.vehiculos[posVh].usuario;
        });

        if (posUsr !== -1) {
          suscripcion.usuario = this.usuarios[posUsr];
        }
      }

    });

    this.dataSource = new MatTableDataSource(this.suscripciones);
    this.dataSource.filterPredicate = this.predicadoBusqueda;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargando = false;

  }

  calcularfecha(fechaEnSegundos: number){
    if(!fechaEnSegundos){
      return '-------';
    }
    return moment(new Date(fechaEnSegundos * 1000)).format('l');
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  regresar() {
    this.router.navigateByUrl('/platform/admin/main');
  }


  fecha(evento, tipo){
    const fecha = evento.value;

    const f = {
      fechaInicio: 'isAfter',
      fechaFinal: 'isBefore',
    }

    this.filtered = this.filtered.filter((element: any) => {

      return moment(new Date(element[tipo]))[f[tipo]](fecha);

    });

    this.dataSource = new MatTableDataSource(this.filtered );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  resetFilters(){
    this.filtered = this.suscripciones;
    this.fechaInicio = '';
    this.fechaFinal = '';

    this.dataSource = new MatTableDataSource(this.suscripciones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}
