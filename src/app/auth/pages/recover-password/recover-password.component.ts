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
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ]
})
export class RecoverPasswordComponent {
  resetPasswordForm: FormGroup;
  message: string = '';

  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  /**
   * @param resetPasswordForm - Recibe el email para cambiar contraseña.
   */
  constructor(private fb: FormBuilder) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * @param sendPasswordResetEmail - Servicio que envía el correo al backend para la respectiva
   * redirrción al cambio de contraseña.
   */
  onResetPassword(): void {
    const email = this.resetPasswordForm.get('email')?.value;
    this._authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        this._router.navigate(['/auth/login']);
      }
    });
  }
}
