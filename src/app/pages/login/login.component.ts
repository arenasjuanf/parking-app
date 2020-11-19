import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../platform/services/auth.service';
import { NotificationService } from '../platform/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  configLoader = constantes.coloresLoader;
  cargando: boolean = false;
  showReset : boolean = false;
  form: FormGroup;

  constructor(private auth: AuthService, private notify: NotificationService) { }

  ngOnInit(): void {
  }

  login(form: NgForm){
    const email = form.value.email;
    const pass = form.value.password;
    if(!this.showReset){
      if (form.valid) {
        this.cargando = true;
        this.auth.login(email, pass);
        setTimeout(() => {
          this.cargando = false;
        }, 2000);
      }
    } else {
      this.auth.recuperarClave(email).then( res => {
        this.notify.notification('success', 'Se ha enviado enlace de cambio de contraseña a tu correo');
        this.showReset = false;
      }).catch(err => {
        this.notify.notification('error', 'Usuario No Encontrado');
      });
    }

  }


}
