import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { RegisterUserInterface } from '../../interfaces/register.interface';
import * as uuid from 'uuid';
import { UserService } from '../../../shared/services/user.service';
import { CustomValidationsService } from '../../../shared/validators/customValidations.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    FontAwesomeModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatStepperModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formStep1: FormGroup;
  formStep2: FormGroup;
  currentStep: string = 'one';
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private readonly _userService: UserService = inject(UserService);
  private readonly _router: Router = inject(Router);
  private readonly _customValidations: CustomValidationsService = inject(
    CustomValidationsService
  );
  private readonly _passwordValidationService: CustomValidationsService =
    inject(CustomValidationsService);

  identificationTypes: { type: string; id: number }[] = [
    { type: 'Cédula de ciudadanía', id: 1 },
    { type: 'Tarjeta de Identidad', id: 2 },
    { type: 'Pasaporte', id: 3 },
    { type: 'Cédula de extrangería', id: 4 }
  ];

  /**
   * Se recibe la información diligenciada en el formulario.
   * @param constructor - Creación del formulario.
   * @param formStep1 - Formulario 1 de información personal.
   * @param formStep2 - Formulario 2 de cuenta.
   */
  constructor(private _fb: FormBuilder) {
    this.formStep1 = this._fb.group({
      identificationTypeId: ['', Validators.required],
      identification: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.formStep2 = this._fb.group(
      {
        avatarUrl: [''],
        username: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            this._passwordValidationService.passwordStrength()
          ]
        ],
        confirmPassword: ['']
      },
      {
        validators: this._customValidations.passwordsMatch(
          'password',
          'confirmPassword'
        )
      }
    );
  }

  /**
   * @param nextStep - Función para seguir al siguiente formulario.
   */
  nextStep() {
    if (this.formStep1.valid) {
      this.currentStep = 'two';
    }
  }

  /**
   * @param save - Envío de información al backend.
   */
  save() {
    if (this.formStep2.valid && this.formStep1.valid) {
      const userToRegister: RegisterUserInterface = {
        id: uuid.v4(),
        identification: this.formStep1.value.identification,
        fullName: this.formStep1.value.fullName,
        email: this.formStep1.value.email,
        phone: this.formStep1.value.phone,
        username: this.formStep2.value.username,
        password: this.formStep2.value.password,
        passwordConfirmation: this.formStep2.get('confirmPassword')?.value,
        avatarUrl: this.formStep2.value.avatarUrl,
        identificationTypeId: 1
      };
      this._userService.register(userToRegister).subscribe({
        next: () => {
          this._router.navigate(['/auth/login']);
        }
      });
    }
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
