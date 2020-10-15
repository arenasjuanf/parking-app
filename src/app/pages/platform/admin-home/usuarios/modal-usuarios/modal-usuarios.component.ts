import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { auth } from 'firebase';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-modal-usuarios',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.scss']
})
export class ModalUsuariosComponent implements OnInit {

  hidden = false;
  formulario: FormGroup;
  imagenDefecto: any = constantes.logoDefecto;
  editar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private db: DatabaseService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalUsuariosComponent>
  ) {

    this.editar = data ? true : false;
    this.initForm();
    if (data) {
      this.formulario.patchValue(data);
      this.imagenDefecto = data.foto ? data.foto : '';
    }
  }

  ngOnInit(): void {
  }

  initForm() {

    const passwordValidator = this.editar ? [] : [Validators.required];

    this.formulario = this.fb.group({
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      idioma: ['', Validators.required],
      password: ['', passwordValidator],
      foto: ['', Validators.required],
      parqueadero: ['', Validators.required],
      estado: [false],
      tipoUsuario: ['admin']
    });
    const idParqueadero = this.auth.datosUsuario.parqueadero;
    this.formulario.get('parqueadero').setValue(idParqueadero);
  }

  submit() {
    if (this.editar) {
      this.db.modificar('usuarios', this.data.key, this.formulario.value).then(result => {
        this.dialogRef.close();
        this.notificationService.notification("success", "Modificado correctamente");
      }).catch(error => {
        this.notificationService.notification("error", "Error al modificar");
        console.log('error modificar: ', error);
      });
    } else {
      const data = Object.assign({}, this.formulario.value);
      delete data.password;
      const email = this.formulario.get('email').value;
      const password = this.formulario.get('password').value;

      this.auth.registrarAdmin(email, password, data).then(result => {
        this.dialogRef.close();
        this.notificationService.notification("success", "Creado correctamente");
      }).catch(error => {
        this.notificationService.notification("error", "Error al crear");
        console.log('error registro: ', error);
      });
    }
  }

  async subirfoto(evento) {
    const file = evento.target.files[0];
    if (file) {
      const str = await this.toBase64(file);
      this.imagenDefecto = str;
      this.formulario.get('foto').setValue(str);
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

  salir() {
    this.dialogRef.close();
  }

}
