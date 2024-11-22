import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  imports: [ReactiveFormsModule, NgIf, MatFormFieldModule, MatInputModule]
})
export class RecoverPasswordComponent {
  resetPasswordForm: FormGroup;
  message: string = '';

  private readonly _authService: AuthService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onResetPassword(): void {
    const email = this.resetPasswordForm.get('email')?.value;
    this._authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        this.message =
          'Si el correo está registrado, recibirás un mensaje con instrucciones.';
      },
      error: (err) => {
        console.error('Error al enviar el correo de recuperación:', err);
        this.message =
          'Hubo un problema al procesar tu solicitud. Inténtalo más tarde.';
      }
    });
  }
}
