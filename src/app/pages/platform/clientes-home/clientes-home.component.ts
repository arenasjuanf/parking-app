import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-clientes-home',
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss']
})
export class ClientesHomeComponent implements OnInit {

  opened: boolean = false;
  datosParqueadero: any;
  parqueaderos: any = [];
  configLoader = constantes.coloresLoader;
  cargando: boolean = false;
  mostrarParking: boolean = false;


  constructor(private auth: AuthService, private afs: AngularFirestore, private db: DatabaseService) {
    this.datosParqueadero = this.auth.datosUsuario;
    this.traerParqueaderos(this.datosParqueadero.parqueadero);
  }

  ngOnInit(): void {
  }

  cerrarSesion(){
    this.auth.cerrarSesion();
  }


  traerParqueaderos(ids: string[]){
    this.cargando = true;
    const observables = [];

    this.afs.collection(`/parqueaderos`, ref => 
      ref.where('clientesActivos', 'array-contains', this.auth.datosUsuario.key)
    ).snapshotChanges().pipe(
      map( (x:any) => x.map( p => {
        return {
          key: p.payload.doc.id,
          razonSocial: p.payload.doc.get('razonSocial'),
          logo: p.payload.doc.get('logo'),
          direccion: p.payload.doc.get('direccion')
        };
      }))
    ).subscribe((result: any) => {
      this.parqueaderos = result;
      this.cargando = false;
    });
  }



  seleccionarParqueadero(parqueadero){
    this.mostrarParking = true;
    const idParqueadero = parqueadero.key;

    this.db.findDoc('parqueaderos', idParqueadero).snapshotChanges().subscribe(result => {
      if (result){
        const plano = JSON.parse(result.payload.get('plano'));
        this.getSubs(plano);
      }
    }, error => {
      console.log('error: ', error);
    });
  }

  getSubs(plano: any[]) {
    const idUser = this.auth.datosUsuario.key;
    const suscripciones: any[] = [];

    plano.forEach(piso => {
      piso.forEach(fila => {
        fila.forEach(casilla => {
          if(casilla.suscripcion){
            const subs = casilla.suscripcion;
            if (subs.vehiculo.usuario === this.auth.datosUsuario.key){
              suscripciones.push(subs);
            }
          }
        });
      });
    });

    console.log(suscripciones)

  }
}
