import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.cerrarSesion();
  }

  login(form: NgForm){
    if(form.valid){
      const email = form.value.email;
      const pass = form.value.password;
      this.auth.login(email, pass);
    }
  }

}
