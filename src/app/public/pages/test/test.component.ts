/* eslint-disable @typescript-eslint/no-unused-expressions */
// test.component.ts
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatInputModule } from '@angular/material/input';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    DatePipe,
    BaseCardComponent,
    BasePageComponent,
    FormsModule,
    MatFormFieldModule,
    CommonModule,
    MatSelectModule,
    FontAwesomeModule,
    MatInputModule
  ],
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  formRolUser: FormGroup;

  currentStep: string = 'one';
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private readonly _userRoleService: TestService = inject(TestService);
  private readonly _router: Router = inject(Router);

  identificationTypes: { type: string; id: number }[] = [
    { type: 'Cédula de ciudadanía', id: 1 },
    { type: 'Tarjeta de Identidad', id: 2 },
    { type: 'Pasaporte', id: 3 },
    { type: 'Cédula de extrangería', id: 4 }
  ];

  role: { type: string; id: number }[] = [
    { type: 'Admin', id: 1 },
    { type: 'Subadmin', id: 2 },
    { type: 'Usuario', id: 3 },
    { type: 'Visitante', id: 4 }
  ];

  /**
   * Aquí se recibe la información del formulario.
   */
  constructor(private _fb: FormBuilder) {
    this.formRolUser = this._fb.group(
      {
        identification: ['', Validators.required],
        identificationTypeId: ['', Validators.required],
        fullName: ['', Validators.required],
        avatarUrl: [''],
        username: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  /**
   * Valida que las contraseñas sean las mismas.
   */
  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  /**
   * Enviar formulario al empoint del backend.
   */
  onSubmit() {
    if (this.formRolUser.valid) {
      const userToRegister: TestService = {
        id: uuidv4(),
        identification: this.formRolUser.value.identification,
        identificationTypeId: 1,
        fullName: this.formRolUser.value.fullName,
        avatarUrl: this.formRolUser.value.avatarUrl,
        username: this.formRolUser.value.username,
        phone: this.formRolUser.value.phone,
        email: this.formRolUser.value.email,
        password: this.formRolUser.value.password,
        passwordConfirmation: this.formRolUser.get('confirmPassword')?.value,
        roleId: 1
      };
      this._userRoleService.rolUser(userToRegister).subscribe({
        next: () => {
          this._router.navigate(['/home']);
        }
      });
    } else {
      // Muestra errores si uno de los formularios no es válido
    }
  }

  /**
   * Ver contraseña en escribir contraseña.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Ver contraseña en confirmar contraseña.
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}