import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-modal-value-rate',
  templateUrl: './modal-value-rate.component.html',
  styleUrls: ['./modal-value-rate.component.scss']
})
export class ModalValueRateComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalValueRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dataBaseService: DatabaseService,
    private notificationService: NotificationService
  ) {
    this.keysValues = Object.keys(this.data.valores);
  }

  formValues: FormGroup;
  keysValues: Array<string>;

  ngOnInit(): void {
    this.configForm();
  }

  configForm() {
    this.formValues = <FormGroup>this.formBuilder.group({});

    this.keysValues.forEach(value => {
      this.formValues.addControl(value, new FormControl(this.data.valores[value], Validators.required))
    });
  }

  closeDialog(value?) {
    this.dialogRef.close(value);
  }

  saveValuesParking() {
    if (this.formValues.valid) {
      const data = { tarifas: {} }
      data.tarifas[this.data.tiempo] = this.formValues.value;
      this.dataBaseService.modificar('parqueaderos', this.data.parqueadero, data).then(respuesta => {
        this.notificationService.notification("success", "Tarifas actualizadas");
        this.closeDialog(true);
      }, error => {
        this.notificationService.notification("error", "No fue posible guardar los cambios");
      });
    }
  }

}
