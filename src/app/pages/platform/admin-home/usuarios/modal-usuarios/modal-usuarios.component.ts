import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-usuarios',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.scss']
})
export class ModalUsuariosComponent implements OnInit {

  constructor( private fb: FormBuilder) { 
    this.initForm();
  }

  hidden = false;
  formulario : FormGroup;

  ngOnInit(): void {
  }

  initForm(){
    this.fb.group({
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],

    })
  }

}
