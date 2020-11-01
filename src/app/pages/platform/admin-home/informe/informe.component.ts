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

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  dataSource: MatTableDataSource<any>;
  branchVehicles: Array<object> = constantes.branchVehicles;
  displayedColumns: Array<string> = ['documento', 'placa', 'marca', 'piso', 'fechaIngreso', 'horaIngreso', 'fechaSalida', 'horaSalida'];
  logs: any[];

  constructor(private router: Router, private auth: AuthService, private db: DatabaseService) {
    this.getLogs();
  }

  ngOnInit(): void {
  }

  volver() {
    this.router.navigateByUrl('/platform/admin/main');
  }

  getLogs(){
    const idParqueadero: string = this.auth.datosUsuario.parqueadero;
    const obs$ = this.db.getPorFiltro('logs', 'parqueadero', idParqueadero).valueChanges().pipe(
      map( logs => {
        logs.map( ( x : any ) => {
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
      console.log(logs);
      if(logs){
        obs$.unsubscribe();
        this.logs = logs;
        this.dataSource = new MatTableDataSource(this.logs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  parsearFecha(seconds, format: string = 'LL') {
    return seconds ? moment(new Date(seconds * 1000)).format(format) : '- - - -';
  }

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Informes.xlsx');

  }

}
