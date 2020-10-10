import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { VistaPlanosComponent } from '../../super-admin-home/vista-planos/vista-planos.component';

@Component({
  selector: 'app-datos-parqueadero',
  templateUrl: './datos-parqueadero.component.html',
  styleUrls: ['./datos-parqueadero.component.scss']
})
export class DatosParqueaderoComponent implements OnInit {

  imagenDefecto: any = constantes.logoDefecto;
  data: object = {};
  form: FormGroup;

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,

  ) {
    this.traerData();
    this.initForm();
  }

  ngOnInit(): void {
  }

  traerData(){
    const idParqueadero = this.auth.datosUsuario.parqueadero;
    this.db.findDoc('parqueaderos', idParqueadero).valueChanges().subscribe((result: object) => {
      result['plano'] = JSON.parse(result['plano']);
      this.data = result;
      this.setearData(this.data);
    });
  }

  initForm() {
    this.form = this.fb.group({
      logo: ['', Validators.required],
      nit: ['', Validators.required],
      razonSocial: ['', Validators.required],
      nombrePropietario: ['', Validators.required],
      paginaWeb: [''],
      correo: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      direccion: ['', Validators.required],
      cantidadPisos: [1, Validators.required],
      capacidadCarros: ['', Validators.required],
      capacidadMotos: ['', Validators.required],
      telefono: ['', Validators.required],
      pisos: this.fb.array([
        this.fb.group({
          piso: [1, Validators.required],
          alto: ['', Validators.required],
          ancho: ['', Validators.required]
        })
      ]),
      plano: [[], Validators.required]
    });

  }

  get pisos() {
    return this.form.get('pisos') as FormArray;
  }

  setearData(datos) {
    for (let i = 1; i < datos.pisos.length; i++) {
      this.pisos.push(this.fb.group({
        piso: [i, Validators.required],
        alto: ['', Validators.required],
        ancho: ['', Validators.required]
      }));
    }

    this.form.patchValue(datos);
    this.imagenDefecto = datos.logo;
  }

  async subirfoto(evento) {
    const file = evento.target.files[0];
    if (file) {
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

  setImagenDefecto() {
    this.imagenDefecto = constantes.logoDefecto;
  }

  gestionarPisos(agregar) {
    let pisos = this.form.get('pisos') as FormArray;
    let valor = this.form.get('cantidadPisos').value;

    if (agregar) {
      valor += 1;
      pisos.push(this.fb.group({
        piso: [valor, Validators.required],
        alto: ['', Validators.required],
        ancho: ['', Validators.required]
      }));

    } else {
      valor -= 1;
      pisos.removeAt(valor );
    }
    this.form.get('cantidadPisos').setValue(valor);
  }

  regresar(){
    this.router.navigateByUrl('/platform/admin/main');
  }

  configurarPlano() {
    const cantidadPisos = this.form.get('cantidadPisos').value;
    const estructura = { tipo: '', numero: '' };
    const plano = [];
    const pisostmp = this.form.get('pisos').value;
    let dataEnviar = [];


    let cont = 0;
    // tslint:disable-next-line: forin
    for (let p in pisostmp) {
      const matriz = [];
      for (let columna = 0; columna < pisostmp[p]['alto']; columna++) {
        const tmpFila = [];
        for (let fila = 0; fila < pisostmp[p]['ancho']; fila++) {
          tmpFila[fila] = Object.assign({}, estructura);
          cont++;
        }
        matriz[columna] = tmpFila;
      }
      plano[p] = matriz;
    }

    

    const cantidad = this.form.get('plano').value.length;

    if (cantidadPisos > this.form.get('plano').value.length){
      const nuevo = plano.splice(cantidad, plano.length);
      this.form.get('plano').setValue(this.form.get('plano').value.concat(nuevo));
    } else {
      const recortado = this.form.get('plano').value.splice(0, cantidadPisos);
      this.form.get('plano').setValue(recortado);
    }

    const data = {
      plano: this.form.get('plano').value.length ? this.form.get('plano').value : plano,
    };

    console.log(data);
    const ref = this.dialog.open(VistaPlanosComponent, {
      data
    });

    ref.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.form.get('plano').setValue(result);
      }
    });
  }


  guardar() {
    const datos = Object.assign({}, this.form.value);
    // se parsea plano
    datos.plano = JSON.stringify(datos.plano);
    const idParqueadero = this.auth.datosUsuario.parqueadero;
   
    this.db.modificar('parqueaderos', idParqueadero , datos).then(
      result => {
        console.log('parqueadero actualizado');
      }
    ).catch(error => {
      console.log('error modificar :', error);
    });
  }

  prueba(){
    return true;
  }

}
