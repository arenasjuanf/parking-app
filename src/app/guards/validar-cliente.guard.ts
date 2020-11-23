import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/platform/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarCliente implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // tslint:disable-next-line: no-debugger

    if (this.auth.datosUsuario) {
      const tipoUsuario = this.auth.datosUsuario.tipo;
      if (tipoUsuario === 'cliente'){
        return true;
      }
      const ruta = `platform`;
      this.router.navigateByUrl(ruta);
      return false;
    } else {
      return true;
    }
  }
}
