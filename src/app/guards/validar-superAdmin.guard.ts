import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/platform/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarSuperAdmin implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.datosUsuario) {
      const tipoUsuario = this.auth.datosUsuario.tipoUsuario;
      if (tipoUsuario === 'superAdmin'){
        return true;
      }
      const ruta = `platform/${tipoUsuario}`;
      this.router.navigateByUrl(ruta);
      return false;
    } else {
      return true;
    }
  }
}
