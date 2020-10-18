import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit  {

  permisos: any;
  keysPermisos: string[];
  seleccionados:any = [];


  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PermisosComponent>
  ){
    this.gerPermisos();
  }

  ngOnInit(): void {
  }


  gerPermisos(){
    this.db.findDoc('permisos', 'permisosBase').valueChanges().subscribe(
      (result) => {
        this.keysPermisos = Object.keys(result);
        this.permisos = result;
        if(this.data){
          //this.seleccionados = this.data;
          console.log(this.data)
          this.validarPermisos(this.data);
        }
      }
    );
  }

  agregar(item, evento){
  /*     console.log(item);
    console.log(evento); */

    if(evento.source.checked){
      this.seleccionados.push(item);
    } else {
      const pos = this.seleccionados.indexOf(item);
      this.seleccionados.splice(pos, 1);
    }
    console.log(this.seleccionados);
  }


  validarPermisos(permisos){
    for (let x of this.keysPermisos){
      for(let z of permisos){
        if( this.permisos[x]['ruta'] === z['ruta'] ){
          this.permisos[x]['checked'] = true;
          this.seleccionados.push(this.permisos[x])
        }
      }
    }
    console.log(this.seleccionados);
  }

  guardar(){
    this.seleccionados.forEach(el => {
      delete el.checked;
      return el;
    });
    this.dialogRef.close(this.seleccionados);
  }

  prueba(){
    return true;
  }

}
