import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { interval, Observable, Observer, timer, zip } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import * as moment from 'moment';

@Component({
  selector: 'app-clientes-home',
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClientesHomeComponent implements OnInit {

  opened: boolean = false;
  datosParqueadero: any;
  parqueaderos: any = [];
  configLoader = constantes.coloresLoader;
  cargando: boolean = false;
  mostrarParking: boolean = false;
  logs: any[];
  tiempos: any[] = [];
  nada: string;
  intervals: any[] = [];

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

    this.getInfo(suscripciones);

  }

  getInfo(suscripciones: any[]){
    const logs: any[] = [];
    suscripciones.forEach(element => {
      logs.push(this.afs.collection('logs').doc(element.idlog).valueChanges());
    });

    zip(...logs).pipe(
      map(
        (items: any[]) => items.map(
          (x: any) => {
            x.fechaReferencia = x.fechaEntrada.seconds,

            x.tiempo = new Observable<string>((observer: Observer<any>) => {
              // tslint:disable-next-line: max-line-length
              const interval = setInterval(() => {
                const segRef = moment(new Date()).diff(new Date(x.fechaReferencia * 1000), 'seconds');
                const horas = Math.floor(segRef / 3600);
                const minutos = Math.floor(((segRef / 3600) % 1) * 60);
                const segundos = Math.floor(((((segRef / 3600) % 1 ) * 60 ) % 1 ) * 60 );
                observer.next( `${horas}:${minutos}:${segundos}`);
              }, 1000);
              this.intervals.push(interval);
            });
            x.fechaEntrada = this.parsearFecha(x.fechaEntrada.seconds);
            return x;
          }
        )
      )
    ).subscribe( (logs: any) => {
      this.logs = logs;
    });

  }

  parsearFecha(seconds, format: string = 'D/M/Y, h:mm:ss a') {
    return seconds ? moment(new Date(seconds * 1000)).format(format) : '- - - -';
  }

  atras(){
    this.limpiarIntervals();
    this.mostrarParking = false;
  }

  getTiempo(obs: Observable<any>, pos: number){
    obs.subscribe( x => this.tiempos[pos] = x );
  }

  limpiarIntervals(){
    this.intervals.forEach((interval: any) => {
      clearInterval(interval);
    })
  }

}
