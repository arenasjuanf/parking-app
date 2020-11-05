import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { constantes } from 'src/app/constantes';
import { AuthService } from '../platform/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  configLoader = constantes.coloresLoader;
  cargando: boolean = false;
  constructor(private auth: AuthService) { }

  form: FormGroup;

  ngOnInit(): void {
  }

  login(form: NgForm){
    if(form.valid){
      this.cargando = true;
      const email = form.value.email;
      const pass = form.value.password;
      this.auth.login(email, pass);
      setTimeout(() => {
        this.cargando = false;
      }, 2000);
    }
  }

}
