import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) {
    console.log("Datatatattata ", data);
  }

  formRegisterUser: FormGroup;

  ngOnInit(): void {
    this.configForm();
  }

  configForm() {
    this.formRegisterUser = this.formBuilder.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      tipo: ['cliente', Validators.required],
      parqueadero: [this.data['parqueadero'], Validators.required],
    });
  }

  closeDialog(data?) {
    this.dialogRef.close(data);
  }

  saveUser() {
    if (this.formRegisterUser.valid) {
      console.log("FOrmulario ", this.formRegisterUser.value);
    } else {
      this.formRegisterUser.markAsTouched();
    }
  }

}
