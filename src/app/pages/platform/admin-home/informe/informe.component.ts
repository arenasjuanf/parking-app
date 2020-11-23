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
import { FormGroup, FormBuilder } from '@angular/forms';

type NewType = number;

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  dataSource: MatTableDataSource<any>;
  branchVehicles: Array<object> = constantes.branchVehicles;
  // tslint:disable-next-line: max-line-length
  displayedColumns: Array<string> = ['cliente', 'documento', 'placa', 'marca', 'piso', 'fechaIngreso', 'horaIngreso', 'fechaSalida', 'horaSalida'];
  logs: any[];
  dataFilter: any[];
  ItemsPerPage = 5;
  currentPage = 0;
  totalLogs: number;
  cargando = false;
  configLoader = constantes.coloresLoader;
  input;
  formFilter: FormGroup;
  floors: any[];

  constructor(
    private router: Router,
    private auth: AuthService,
    private db: DatabaseService,
    public afs: AngularFirestore,
    private builder: FormBuilder
  ) {
    this.getLogs();
    this.getFloors();
  }

  ngAfterViewInit() {
    this.countLogs();
  }

  ngOnInit(): void {
    this.createForm();
  }

  volver() {
    this.router.navigateByUrl('/platform/admin/main');
  }

  getLogs() {
    this.cargando = true;
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    const obs$ = this.db.getPorFiltro('logs', 'parqueadero', idParqueadero).valueChanges().pipe(
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
      if (logs) {
        obs$.unsubscribe();
        this.logs = logs;
        this.dataFilter = logs;
        this.configTable(this.logs);
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

  configTable(list) {
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm() {
    this.formFilter = <FormGroup>this.builder.group({
      fechaEntrada: [],
      fechaSalida: [],
      documento: [],
      placa: [],
      marca: [],
      piso: [],
      tipo: []
    });

    this.formFilter.valueChanges.subscribe(cambios => {
      const respuesta = Object.assign({}, cambios);
      let bandera = 0;
      const f = {
        fechaEntrada: 'isSameOrAfter',
        fechaSalida: 'isSameOrBefore',
      }
      Object.keys(respuesta).forEach(item => {
        if (respuesta[item] && respuesta[item] !== "") {
          this.dataFilter = this[(bandera < 1 ? 'logs' : 'dataFilter')].filter(log => {
            let dato = log[item] + "";
            if (typeof respuesta[item] === 'object') {
              return moment(new Date(log[item]))[f[item]](respuesta[item]);
            } else if (log.datosVehiculo[item]) {
              dato = log.datosVehiculo[item] + "";
            } else if (log.datosCliente[item]) {
              dato = log.datosCliente[item] + "";
            } else if (log.puesto[item] >= 0) {
              dato = log.puesto[item] + "";
            }
            return dato.toLowerCase().includes(respuesta[item].toLowerCase());
          });
          bandera++;
        }
      });
      this.configTable(bandera > 0 ? this.dataFilter : this.logs);
      if (bandera < 1) {
        this.dataFilter = this.logs;
      }
    });
  }

  getFloors() {
    this.db.findDoc('parqueaderos', this.auth.datosUsuario.parqueadero).snapshotChanges().subscribe(respuesta => {
      this.floors = respuesta.payload.get('pisos');
    }, error => {
      console.log("Error ", error);
    });
  }

}
