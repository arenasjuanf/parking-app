import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  datosUsuario: any; // data De Usuario loggeado


  constructor(
    public afs: AngularFirestore,   
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
    public router: Router,
    private dbService: DatabaseService

  ) { 
    this.validarData();
  }


  validarData(){
    this.afAuth.authState.subscribe(user => {
      console.log('user info: ', user);
      return;
      if (user) {
        this.datosUsuario = user;
        localStorage.setItem('usuario', JSON.stringify(this.datosUsuario));
        //JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('usuario', null);
        //JSON.parse(localStorage.getItem('usuario'));
      }
    })
  }

  login(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(result){
          this.validarTipoUser(result.user);
        }
      }).catch((error) => {
        console.log('error');
      });
  }

  registrar(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result)
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  recuperarClave(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  get estaLoggeado(): boolean {
    const user = JSON.parse(localStorage.getItem('usuario'));
    return (user !== null) ? true : false;
  }

  cerrarSesion() {
    return this.afAuth.signOut().then(() => {})
  }

  SetUserData(user) {

    /* const userRef = this.afs.collection('usuarios'); */
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    }

    this.dbService.addData('usuarios', userData).then( res => {
      console.log('res: ', res);
    })
  }

  validarTipoUser(usuario){
    const data = this.dbService.getPorId('usuarios', usuario.uid).snapshotChanges().pipe(
      map(x => x[0].payload.val())
    ).subscribe(usuario => {
      const ruta = `${usuario['tipoUsuario']}/home`;
      this.router.navigateByUrl(ruta);
    });
  }

}
