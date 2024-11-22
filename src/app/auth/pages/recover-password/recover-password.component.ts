import { NgIf } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  // FormGroup,
  // FormControl,
  // Validators,
  ReactiveFormsModule
  // FormBuilder
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  imports: [ReactiveFormsModule, NgIf, MatFormFieldModule]
})
export class RecoverPasswordComponent {
  // resetPasswordForm: FormGroup;
  // message: string = '';
  // constructor(
  //   private fb: FormBuilder,
  //   private http: HttpClient
  // ) {
  //   this.resetPasswordForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]]
  //   });
  // }
  // onResetPassword(): void {
  //   const email = this.resetPasswordForm.get('email')?.value;
  //   this.passwordResetService.sendPasswordResetEmail(email).subscribe({
  //     next: (response: any) => {
  //       this.message =
  //         'Si el correo está registrado, recibirás un mensaje con instrucciones.';
  //     },
  //     error: (err) => {
  //       console.error('Error al enviar el correo de recuperación:', err);
  //       this.message =
  //         'Hubo un problema al procesar tu solicitud. Inténtalo más tarde.';
  //     }
  //   });
  // }
}
