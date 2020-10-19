import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../platform/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }
  
  form: FormGroup;

  ngOnInit(): void {

  }

  login(form: NgForm){
    if(form.valid){
      const email = form.value.email;
      const pass = form.value.password;
      this.auth.login(email, pass);
    }
  }




}
