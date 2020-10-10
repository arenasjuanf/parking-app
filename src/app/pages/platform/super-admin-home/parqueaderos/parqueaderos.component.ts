import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GestionParqueaderoComponent } from '../gestion-parqueadero/gestion-parqueadero.component';
import { DatabaseService } from '../../services/database.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-parqueaderos',
  templateUrl: './parqueaderos.component.html',
  styleUrls: ['./parqueaderos.component.scss']
})
export class ParqueaderosComponent implements OnInit  {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['logo', 'documento', 'nombre', 'telefono', 'acciones'];
  dataSource: MatTableDataSource<any>;
  

  listaParqueaderos: object[];

  constructor(
    public dialog: MatDialog,
    private dbService: DatabaseService,
    public auth: AuthService)
  {
    this.getParqueaderos();
  }

  ngOnInit(): void {
  }



  abrirModal(datos?, accion = 'crear'){
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

  getParqueaderos(){
    this.dbService.getData('parqueaderos').pipe(
      map((x:any[]) => {
        return x.map(park => ({  ...park.payload.doc.data(), key: park.payload.doc.id }));
      })
    ).subscribe(result =>{
      result = result.map(park => {
        park.plano = JSON.parse(park.plano);
        return park;
      });
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
    });
  }

  cambiarEstado(elemento){
    this.dbService.modificar('parqueaderos', elemento.key, { estado: elemento.estado ? false : true })
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
