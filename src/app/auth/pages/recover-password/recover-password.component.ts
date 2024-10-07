import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  imports: [ReactiveFormsModule, NgIf]
})
export class RecoverPasswordComponent {
  recoverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  emailSent = false;

  constructor() { 
    console.log("Email sent")
  }

  onSubmit() {
    if (this.recoverForm.valid) {
      console.log('Correo electrónico para recuperación:', this.recoverForm.value.email);
      this.emailSent = true;
    } else {
      console.log('El formulario no es válido');
    }
  }
}
