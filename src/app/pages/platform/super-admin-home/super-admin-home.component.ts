import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrls: ['./super-admin-home.component.css']
})
export class SuperAdminHomeComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  validar(){
    this.auth.cerrarSesion();
  }
}
