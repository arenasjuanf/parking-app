import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../services/auth.service';

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


  constructor(private auth: AuthService, private afs: AngularFirestore) {
    this.datosParqueadero = this.auth.datosUsuario;
    this.traerParqueaderos(this.datosParqueadero.parqueadero);
  }

  ngOnInit(): void {
  }

  cerrarSesion() {
    this.auth.cerrarSesion();
  }


  traerParqueaderos(ids: string[]){
    this.cargando = true;
    const observables = [];
    ids.forEach(id => {
      observables.push( this.afs.collection('parqueaderos').doc(id).valueChanges() );
    });

    zip(...observables).pipe(
      map( elem => elem.map(x => {
        return {
          razonSocial: x['razonSocial'],
          logo: x['logo'],
          direccion: x['direccion']
        };
      }))
    ).subscribe((result: any) => {
      console.log(result);
      this.parqueaderos = result;
      this.cargando = false;
    });
  }
}
