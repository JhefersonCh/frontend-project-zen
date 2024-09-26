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
  // Creación del formulario reactivo
  recoverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  // Variable para controlar si se ha enviado el correo
  emailSent = false;

  constructor() { 
    console.log("Email sent")
  }

  // Función que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.recoverForm.valid) {
      console.log('Correo electrónico para recuperación:', this.recoverForm.value.email);
      this.emailSent = true; // Simula el envío de correo mostrando un mensaje de éxito
    } else {
      console.log('El formulario no es válido');
    }
  }
}
