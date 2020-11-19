import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { map } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

type NewType = number;

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent implements OnInit, AfterViewInit  {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  dataSource: MatTableDataSource<any>;
  branchVehicles: Array<object> = constantes.branchVehicles;
  // tslint:disable-next-line: max-line-lengthb
  displayedColumns: Array<string> = ['cliente', 'documento', 'placa', 'marca', 'piso', 'fechaIngreso', 'horaIngreso', 'fechaSalida', 'horaSalida'];
  logs: any[];
  ItemsPerPage = 5;
  currentPage = 0;
  totalLogs: number;
  cargando = false;
  configLoader = constantes.coloresLoader;
  input;

  constructor(
    private router: Router,
    private auth: AuthService,
    private db: DatabaseService,
    public afs: AngularFirestore
  ) {
    this.getLogs();
  }

  ngAfterViewInit() {
    this.countLogs();
  }

  ngOnInit(): void {
  }

  volver() {
    this.router.navigateByUrl('/platform/admin/main');
  }

  getLogs() {
    this.cargando = true;
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    const obs$ = this.db.getPorFiltro('logs', 'parqueadero', idParqueadero).valueChanges().pipe(
      map( logs => {
        logs.map( ( x: any ) => {
          x.datosCliente.documento = parseInt(x.datosCliente.documento);
          x.horaEntrada = this.parsearFecha(x?.fechaEntrada?.seconds, 'LT');
          x.horaSalida = this.parsearFecha(x?.fechaSalida?.seconds, 'LT');
          x.fechaEntrada = this.parsearFecha(x?.fechaEntrada?.seconds);
          x.fechaSalida = this.parsearFecha(x?.fechaSalida?.seconds);
          return x;
        });
        return logs;
      })
    ).subscribe( logs => {
      if (logs) {

        obs$.unsubscribe();
        this.logs = logs;
        this.dataSource = new MatTableDataSource(this.logs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cargando = false;
      }
    });
  }

  parsearFecha(seconds, format: string = 'LL') {
    return seconds ? moment(new Date(seconds * 1000)).format(format) : '- - - -';
  }

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement); // converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Informes.xlsx');
  }

  cambiosPaginator(evento) {

    this.ItemsPerPage = evento.pageSize;
    this.currentPage = evento.pageIndex;
    this.paginator.length = this.totalLogs;
    this.getLogs();

  }

  /* getLogs(){
    this.cargando = true;
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    const cantidad = this.currentPage ? ((this.currentPage + 1) * this.ItemsPerPage) : this.ItemsPerPage;
    const obs$ = this.afs.collection(`/logs`, ref =>
      ref.where('parqueadero', '==', idParqueadero).limit(cantidad)
    ).valueChanges().pipe(
      map(logs => {
        logs.map((x: any) => {
          x.datosCliente.documento = parseInt(x.datosCliente.documento);
          x.horaEntrada = this.parsearFecha(x?.fechaEntrada?.seconds, 'LT');
          x.horaSalida = this.parsearFecha(x?.fechaSalida?.seconds, 'LT');
          x.fechaEntrada = this.parsearFecha(x?.fechaEntrada?.seconds);
          x.fechaSalida = this.parsearFecha(x?.fechaSalida?.seconds);
          return x;
        });
        return logs;
      })
    ).subscribe(logs => {
      this.cargando = false;
      if (logs) {
        obs$.unsubscribe();
        this.logs = logs;
        this.dataSource = new MatTableDataSource(this.logs);
        if (this.paginator) {
          this.paginator.length = this.totalLogs;
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

  } */

  countLogs(): void {
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    const obs$ = this.db.getPorFiltro('logs', 'parqueadero', idParqueadero).valueChanges().subscribe(
      (result: any) => {
        if (result) {
          this.totalLogs = result.length;
          this.paginator.length = result.length;
          obs$.unsubscribe();
        }
      }
    );
  }

}
