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

  sesionActiva: boolean; // variable que almacena si hay sesión o no


  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
    public router: Router,
    private dbService: DatabaseService

  ) {
    // el observable mantiene listo vigilando la sesión
    this.validarSesion();
  }


  async validarSesion(){
    this.afAuth.authState.subscribe(user => {
      if (user && localStorage.getItem('usuario')) {
        console.log('hay una sesión activa');
        this.sesionActiva = true;
      } else{
        console.log('sesion cerrada');
        localStorage.setItem('usuario', null);
        this.sesionActiva = false;
        this.router.navigateByUrl('/login');
      }
    });

  }

  guardarLS(datosUsuario, update?){
    if(update){
      const tmp = Object.assign(this.datosUsuario, datosUsuario);
      localStorage.setItem('usuario', JSON.stringify(tmp));
    }else{
      localStorage.setItem('usuario', JSON.stringify(datosUsuario));

    }
  }

  login(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(result){
          this.validarTipoUser(result.user);
        }
      }).catch((error) => {
        window.alert(error);
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

  registrarAdmin(email, password, data) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = {
          ...data,
          uid: result.user.uid,
          email: result.user.email,
          emailVerified: result.user.emailVerified
        }
        this.SetUserData(user, true);

      }).catch((error) => {
        window.alert(error.message);
      });
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

  get datosUsuario(){
    return JSON.parse(localStorage.getItem('usuario'));
  }


  cerrarSesion() {
    return this.afAuth.signOut();
  }

  SetUserData(user, admin?) {

    /* const userRef = this.afs.collection('usuarios'); */
    const userData = admin ? user : {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    }

    this.afs.collection(`/usuarios`).add(userData).then(res => {
      console.log('res setUserData: ', res);
    }).catch(error => {
      console.log('error: ', error);
    });
  }

  validarTipoUser(usuario){
    this.dbService.getPorId('usuarios', usuario.uid).snapshotChanges().subscribe(usuario => {
        const user = usuario[0].payload.doc.data();
        user['id'] = usuario[0].payload.doc.id;
        this.guardarLS(Object.assign({}, user));
        const ruta = `platform/${user['tipoUsuario']}`;
        this.router.navigateByUrl(ruta);
      });
  }

}
