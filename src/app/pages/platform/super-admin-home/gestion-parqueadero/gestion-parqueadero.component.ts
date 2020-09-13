import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { constantes } from 'src/app/constantes';
import { VistaPlanosComponent } from '../vista-planos/vista-planos.component';
import { ɵangular_packages_platform_browser_platform_browser_j } from '@angular/platform-browser';

@Component({
  selector: 'app-gestion-parqueadero',
  templateUrl: './gestion-parqueadero.component.html',
  styleUrls: ['./gestion-parqueadero.component.scss']
})
export class GestionParqueaderoComponent implements OnInit {

  form: FormGroup;
  mostrarTabla: boolean = false;
  imagenDefecto:any = constantes.logoDefecto;
  accion: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataRecibida: any,
    private fb: FormBuilder,
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<GestionParqueaderoComponent>,
    public auth: AuthService,
    public dialog: MatDialog,
  ) {
    this.accion = this.dataRecibida.accion;
    this.initForm();
    if(this.accion != 'crear'){
      this.setearData();
    }
  }

  ngOnInit(): void {
  }

  initForm() {
    this.form = this.fb.group({
      logo: ['', Validators.required],
      nit: ['', Validators.required],
      razonSocial: ['', Validators.required],
      nombrePropietario: ['', Validators.required],
      paginaWeb: [''],
      correo: ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      direccion: ['', Validators.required],
      cantidadPisos: [1, Validators.required],
      capacidadCarros: ['', Validators.required],
      capacidadMotos: ['', Validators.required],
      telefono: ['', Validators.required],
      pisos: this.fb.array([
        this.fb.group({
          piso: [1, Validators.required],
          cantidadCarros: ['', Validators.required],
          cantidadMotos: ['', Validators.required]
        })
      ]),
      plano:[[], Validators.required]
    });

    this.form.get('pisos').valueChanges.subscribe(cambios => {
      if (this.form.get('pisos').valid){
        console.log('entraa');
        this.visualizarPlano();
      }
    });

  }

  get pisos(){
    return this.form.get('pisos') as FormArray;
  }

  async subirfoto(evento){
    const file = evento.target.files[0];
    if(file){
      const str = await this.toBase64(file);
      this.imagenDefecto = str;
      this.form.get('logo').setValue(str);
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  setImagenDefecto(){
    this.imagenDefecto = constantes.logoDefecto;
  }

  registrarParqueadero(){
    if(this.form.valid){
      this.dbService.addData('parqueaderos', this.form.value).then(res => {
        console.log(res.key);
        this.registrarAdmin(res.key);
      })
    }
  }

  registrarAdmin(idParqueadero) {
    const data = {
      parqueaderos: [idParqueadero],
      tipoUsuario: 'admin',
      nombre: this.form.get('nombrePropietario').value
    };
    const email = this.form.value['correo'];
    const pass = this.form.value['nit'];
    this.auth.registrarAdmin(email, pass, data ).then(result => {
      this.dialogRef.close();
    }).catch(error => {
      console.log('error registro: ', error);
    });
  }

  gestionarPisos(agregar){
    let pisos = this.form.get('pisos') as FormArray;
    let valor = this.form.get('cantidadPisos').value;

    if(agregar){
      valor +=1;
      pisos.push(this.fb.group({
        piso: [valor, Validators.required],
        cantidadCarros: ['', Validators.required],
        cantidadMotos: ['', Validators.required]
      }));

    }else{
      valor -=1;
      pisos.removeAt(valor-1);
    }
    this.form.get('cantidadPisos').setValue(valor);
  }

  visualizarPlano(mostrar?){
    let plano = [];


    const pisos = this.form.get('pisos').value;

    pisos.forEach(element => {
      let cont = 1;
      const objPiso = {};
      objPiso['piso'] = element.piso;
      if (element.cantidadCarros) {
        const carros = [];
        for (let i = 1; i <= element.cantidadCarros; i++) {
          const objPuestoCarro = {};
          objPuestoCarro['puesto'] = cont + (element.piso * 100);
          objPuestoCarro['clase'] = 'carro';
          cont++;
          carros.push(objPuestoCarro);
        }
        objPiso['carros'] = carros;
      }
      if (element.cantidadMotos) {
        const motos = [];
        for (let i = 1; i <= element.cantidadMotos; i++) {
          const objPuestoCarro = {};
          objPuestoCarro['puesto'] = cont + (element.piso * 100);
          objPuestoCarro['clase'] = 'moto';
          cont++;
          motos.push(objPuestoCarro);
        }
        objPiso['motos'] = motos;
      }

      plano.push(objPiso);
    });
    this.form.get('plano').setValue(plano);


    if (mostrar) {
      this.dialog.open(VistaPlanosComponent, {
        data: plano,
        maxWidth: 700,
        maxHeight: 600,
        minHeight: 600,
        minWidth: 700
      })
    }

  }

  setearData(){
    if (this.dataRecibida){

      for (let i = 1; i < this.dataRecibida.pisos.length; i++) {
        this.pisos.push(this.fb.group({
          piso: [i, Validators.required],
          cantidadCarros: ['', Validators.required],
          cantidadMotos: ['', Validators.required]
        }));
      }

      this.form.patchValue(this.dataRecibida);
      this.imagenDefecto = this.dataRecibida.logo;
      this.accion = this.dataRecibida.accion;
      if(this.accion == 'ver'){
        this.form.disable();
        console.log(this.form)
      }
    }
  }

  guardar(){
    switch(this.accion){
      case 'crear':
        this.registrarParqueadero();
        break;
      case 'modificar':
        console.log('modificar: ', this.dataRecibida.key);
        this.dbService.modificar('parqueaderos', this.dataRecibida.key, this.form.value).then(
          result => {
            console.log('resultado modificar: ', result)
          }
        ).catch( error => {
          console.log('error modificar :', error);
        });
        break;
      default:
        console.log('otro: ', this.accion);
    }

  }


}
