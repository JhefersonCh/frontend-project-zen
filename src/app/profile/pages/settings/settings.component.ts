import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatIcon } from '@angular/material/icon';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../shared/services/user.service';
// import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    BasePageComponent,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  changePasswordForm: FormGroup;
  passwordMismatch = false;
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showOldPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private readonly _userService: UserService = inject(UserService);
  // private readonly _fb: FormBuilder = inject(FormBuilder);
  // private readonly _router: Router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  onChangePassword(): void {
    const { oldPassword, newPassword, confirmNewPassword } =
      this.changePasswordForm.value;

    if (newPassword !== confirmNewPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    // Llamada al servicio para cambiar la contraseña
    this._userService
      .updateUserPassword({
        oldPassword,
        newPassword,
        confirmNewPassword
      })
      .subscribe({
        next: () => {
          // Navegación al perfil después de un cambio exitoso
          // this._router.navigate(['../../profile']);
          // this.changePasswordForm.reset();
          console.log(newPassword);
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
          // Aquí podrías mostrar un mensaje de error al usuario si algo sale mal
        }
      });
  }
  /**
   * @param toggleOldPasswordVisibility - Ver antigua contraseña.
   */
  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  /**
   * @param togglePasswordVisibility - Ver contraseña.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * @param toggleConfirmPasswordVisibility - Ver confirmar contraseña.
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
