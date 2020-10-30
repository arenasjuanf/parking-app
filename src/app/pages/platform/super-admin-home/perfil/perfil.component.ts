import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantes } from 'src/app/constantes';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  imagen: string = '../../../../assets/images/usuario.png';
  form: FormGroup;
  idiomas = constantes.idiomas;
  constructor(
    private auth: AuthService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<PerfilComponent>,
    private db: DatabaseService,
    private router: Router
  ) {
    this.initForm();
    this.setearDatos();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.form = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      direccion: ['', Validators.required],
      idioma: ['', Validators.required],
      foto: ['', Validators.required],
    })
  }

  async subirfoto(evento) {
    const file = evento.target.files[0];
    if (file) {
      const str = await this.toBase64(file);
      this.form.get('foto').setValue(str);
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  setearDatos(){
    if(this.auth.datosUsuario){
      this.form.patchValue(this.auth.datosUsuario);
    }
  }

  quitarFoto() {
    this.form.get('foto').setValue('');
  }

  guardar() {
    console.log(this.auth.datosUsuario);

    this.db.modificar('usuarios', this.auth.datosUsuario.id, this.form.value).then(r => {
      console.log('datos actualizados');
      // se actualizan datos de local storage
      this.auth.guardarLS(this.form.value, true);
      this.dialogRef.close();
    });
  }

  languageSelected(evento) {
    this.router.navigateByUrl(`/${evento.value}/`);
  }

}
