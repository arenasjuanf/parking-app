import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // se definen las colecciones
  private dataPrueba: AngularFireList<any>;
  private usuarios: AngularFireList<any>;
  private vehiculos: AngularFireList<any>;
  private parqueaderos: AngularFireList<any>;



  constructor(private db: AngularFireDatabase, public afs: AngularFirestore) {
    // se crea referencia de las colecciones
    this.crearReferenciasDB();
  }


  // referenciamos las colecciones para poder ser usadas
  crearReferenciasDB(){
    this.dataPrueba = this.db.list('/dataPrueba');
    this.usuarios = this.db.list('/usuarios');
    this.vehiculos = this.db.list('/vehiculos');
    this.parqueaderos = this.db.list('/parqueaderos');
  }


  // descripción: agregar data a una colección especifica
  // parametros: 
  // nombre_coleccion = nombre de la referencia de la coleccion
  // obj = Objeto estructurado de la data a guardar
  addData(nombre_coleccion: string, obj: any) {
    return this.afs.collection(`/${nombre_coleccion}`).add(obj);
  }

  // descripción: Borrar un Jugador de la DB
  // parametros: 
  // nombre_coleccion = nombre de la referencia de la coleccion
  // id = id de documento a eliminar
  deleteData(nombre_coleccion: string, id: string) {
    this.db.list(`/${nombre_coleccion}`).remove(id);
  }

  // descripción: trae todos los objetos de una colección
  // parametros: 
  // nombre_coleccion = nombre de la referencia de la coleccion
  getData(nombre_coleccion: string): Observable<any[]> {
    return this.afs.collection(nombre_coleccion).snapshotChanges();
  }

  getPorId(nombre_coleccion, uid){
    return this.afs.collection(nombre_coleccion, ref => ref.where('uid', '==', uid));
  }

  getPorFiltro(nombre_coleccion, filtro, valor) {
    return this.afs.collection(`/${nombre_coleccion}`, ref =>
      ref.where(filtro, '==', valor)
    );
  }

  findDoc(nombre_coleccion, idDoc){
    return this.afs.collection(nombre_coleccion).doc(idDoc);
  }


  // descripción: modifica documento especificando coleccion y id
  // parametros: 
  // nombre_coleccion = nombre de la referencia de la coleccion
  // id = id documento
  // data: nuevos datos a ingresar
  modificar(nombre_coleccion, id, data){
    return this.afs.collection(nombre_coleccion).doc(id).set(data, {merge: true});
  }

}
