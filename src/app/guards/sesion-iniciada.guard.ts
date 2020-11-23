import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/platform/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SesionIniciadaGuard implements CanActivate {

  // se valida sesion y tipo de usuario

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
    if (this.auth.datosUsuario) {
      const tipoUsuario = this.auth.datosUsuario.tipoUsuario || this.auth.datosUsuario.tipo;
      if (tipoUsuario){
        const ruta = `platform/${tipoUsuario}`;
        this.router.navigateByUrl(ruta);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

}
