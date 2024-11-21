import { Component, inject, OnInit } from '@angular/core';
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
import { IdentificationType } from '../../../organizational/users/interfaces/users.interface';

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
export class RegisterComponent implements OnInit {
  formStep1: FormGroup;
  formStep2: FormGroup;
  currentStep: string = 'one';
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  identificationTypes: IdentificationType[] = [];
  private readonly _userService: UserService = inject(UserService);
  private readonly _router: Router = inject(Router);
  private readonly _customValidations: CustomValidationsService = inject(
    CustomValidationsService
  );
  private readonly _passwordValidationService: CustomValidationsService =
    inject(CustomValidationsService);

  /**
   * Se recibe la información diligenciada en el formulario.
   * @param constructor - Creación del formulario.
   * @param formStep1 - Formulario 1 de información personal.
   * @param formStep2 - Formulario 2 de cuenta.
   * @param passwordStrength - Válida que la contraseña poseea más de 6 carácteres, 1 minúscula, 1 mayúscula y 1 carácter especial.
   * @param passwordsMatch - Válida que la contraseña sea igual a confirmar contraseña.
   */
  constructor(private _fb: FormBuilder) {
    this.formStep1 = this._fb.group({
      identificationTypeId: ['', Validators.required],
      identification: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^3\\d{9}$')]]
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
        confirmPassword: ['', [Validators.required]]
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
   * Inicializa el campo confirmar contraseña como disable.
   * @param ngOnInit - Trae la data.
   * @param formStep2 - Le decimos al campo confirmPassword que inicie bloqueado.
   * @param formStep2 - Luego condicionamos para que al llenar password se desbloque confirmPassword.
   */
  ngOnInit(): void {
    this.getRelatedData();
    this.formStep2.get('confirmPassword')?.disable();
    this.formStep2.get('password')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.formStep2.get('confirmPassword')?.disable();
      } else {
        this.formStep2.get('confirmPassword')?.enable();
      }
    });
  }

  /**
   * @param getRelatedData - Obtiene los tipos de identificación.
   */
  getRelatedData(): void {
    this._userService.registerRelatedData().subscribe({
      next: (res) => {
        this.identificationTypes = res.data?.identificationTypes || [];
      }
    });
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
