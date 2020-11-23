import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-historial-usuarios',
  templateUrl: './historial-usuarios.component.html',
  styleUrls: ['./historial-usuarios.component.scss']
})
export class HistorialUsuariosComponent implements OnInit {

  listLogs: any[] = [];
  cargando: boolean = false;
  configLoader = constantes.coloresLoader;
  parkings: Array<object> = [];
  dataFilter: any[] = [];
  formFilter: FormGroup;
  branchVehicles: Array<object> = constantes.branchVehicles;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  dataSource: MatTableDataSource<any>;
  displayedColumns: Array<string>;

  constructor(private dbService: DatabaseService, private builder: FormBuilder) {
    this.getUsuarios();
    this.getParkings();
  }

  ngOnInit(): void {
    this.createForm();
  }

  getUsuarios() {
    this.cargando = true;
    const obs$ = this.dbService.getData('logs').pipe(
      map((x: any[]) => {
        return x.map(h => ({
          documento: h.payload.doc.get('datosCliente.documento'),
          nombre: h.payload.doc.get('datosCliente.nombre'),
          placa: h.payload.doc.get('datosVehiculo.placa'),
          tipo: h.payload.doc.get('datosVehiculo.tipo'),
          key: h.payload.doc.id,
          horaEntrada: this.parsearFecha(h.payload.doc.get('fechaEntrada'), 'LT'),
          horaSalida: this.parsearFecha(h.payload.doc.get('fechaSalida'), 'LT'),
          fechaEntrada: this.parsearFecha(h.payload.doc.get('fechaEntrada')),
          fechaSalida: this.parsearFecha(h.payload.doc.get('fechaSalida')),
          parqueadero: h.payload.doc.get('parqueadero')
        }));
      })
    ).subscribe(logs => {
      if (logs) {
        obs$.unsubscribe();
        this.listLogs = logs;
        this.displayedColumns = Object.keys(this.listLogs[0]).filter(k => k !== 'key' && k !== 'parqueadero');
        this.dataFilter = logs;
        this.cargando = false;
        this.configTable(this.listLogs);
      }
    });
  }

  createForm() {
    this.formFilter = <FormGroup>this.builder.group({
      fechaEntrada: [],
      fechaSalida: [],
      documento: [],
      placa: [],
      parqueadero: [],
      tipo: []
    });

    this.formFilter.valueChanges.subscribe(respuesta => {
      let bandera = 0;
      const f = {
        fechaEntrada: 'isSameOrAfter',
        fechaSalida: 'isSameOrBefore',
      }
      Object.keys(respuesta).forEach(item => {
        if (respuesta[item] && respuesta[item] !== "") {
          this.dataFilter = this[(bandera < 1 ? 'listLogs' : 'dataFilter')].filter(log => {
            let dato = log[item] + "";
            if (typeof respuesta[item] === 'object') {
              return moment(new Date(log[item]))[f[item]](respuesta[item]);
            }
            return dato.toLowerCase().includes(respuesta[item].toLowerCase());
          });
          bandera++;
        }
      });
      this.configTable(bandera > 0 ? this.dataFilter : this.listLogs);
      if (bandera < 1) {
        this.dataFilter = this.listLogs;
      }
    });
  }

  getParkings() {
    this.dbService.getData('parqueaderos').pipe(
      map((x: any[]) => {
        return x.map(park => ({ nombre: park.payload.doc.get('razonSocial'), key: park.payload.doc.id }));
      })
    ).subscribe(respuesta => {
      this.parkings = respuesta;
    }, error => {
      console.log("Error ", error);
    });
  }

  parsearFecha(seconds, format: string = 'LL') {
    return seconds ? moment(new Date((seconds.seconds ? seconds.seconds : seconds) * 1000)).format(format) : '- - - -';
  }

  configTable(list) {
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
