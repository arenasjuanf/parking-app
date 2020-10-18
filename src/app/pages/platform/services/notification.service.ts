import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    alertify.defaults['glossary'] = {
      title: '',
      ok: 'Aceptar',
      cancel: 'Cancelar'
    } // Valores por defecto en los botones;
    alertify.defaults['notifier'].closeButton = true; // MOstrar boton de cerrar en la notificacion
  }

  /* Type: success - error - warning - message */
  notification(type: string, message: string, title: string = '') {
    alertify.defaults['glossary'].title = title;
    alertify[type](message);
  }

  /*
    message: mensaje que aparecera en la modal
    context: este es this, para saber desde que componente se llama
    functionSuccess: string del nombre la funcion si dan aceptar
    functionError: string del nombre la funcion si dan cancelar 
    title: Titulo de la modal
   */
  alert(message: string, context: any, functionSuccess: string, functionError: string, title: string = '') {
    alertify.defaults['glossary'].title = title;
    alertify.confirm(message, (resp) => {
      context[functionSuccess]();
    }, (error) => {
      context[functionError]()
    });
  }

  /*
    message: mensaje que aparecera en la modal
    context: este es this, para saber desde que componente se llama
    functionSuccess: string del nombre la funcion si dan aceptar
    functionError: string del nombre la funcion si dan cancelar 
    valueDefectInput: valor por defecto en el campo
    title: Titulo de la modal
   */
  prompt(message: string, context: any, functionSuccess: string, functionError: string, title: string = '', valueDefectInput: string = "") {
    alertify.defaults['glossary'].title = title;
    alertify.prompt(message, valueDefectInput, (evento, valor) => {
      context[functionSuccess](valor);
    }, (error) => {
      context[functionError]()
    });
  }

}