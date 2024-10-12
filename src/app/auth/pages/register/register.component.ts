import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
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

  identificationTypes: { type: string; id: number }[] = [
    { type: 'Cédula de ciudadanía', id: 1 },
    { type: 'Tarjeta de Identidad', id: 2 },
    { type: 'Pasaporte', id: 3 },
    { type: 'Cédula de extrangería', id: 4 }
  ];

  constructor(private _fb: FormBuilder) {
    this.formStep1 = this._fb.group({
      creationDate: [new Date()],
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
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  nextStep() {
    if (this.formStep1.valid) {
      this.currentStep = 'two';
    } else {
      // Lógica para mostrar mensajes de error
    }
  }

  submitForm() {
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
      this._userService.registrer(userToRegister).subscribe({
        next: () => {
          this._router.navigate(['/auth/login']);
        }
      });
    } else {
      // Muestra errores si uno de los formularios no es válido
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
