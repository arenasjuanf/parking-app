import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/platform/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidacionSesionGuard implements CanActivate {

  constructor(private auth: AuthService){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.auth.datosUsuario){
      return true;
    } else {
      return false;
    }
  }
}
