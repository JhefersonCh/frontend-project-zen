import { Component } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

})
export class RegisterComponent {
  
  formStep1: FormGroup;
  formStep2: FormGroup;
  currentStep: string = "one"; 
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  tiposIdentificacion: string[] = ['Cédula de ciudadanía', 'Tarjeta de Identidad', 'Pasaporte'];

  constructor(private _fb: FormBuilder) {

    this.formStep1 = this._fb.group({
      creationDate: [new Date()],
      typeID: ['', Validators.required],
      identification: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    this.formStep2 = this._fb.group({
      avatarUrl: ['', ],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  nextStep() {
    if (this.formStep1.valid) {
      this.currentStep = "two"; 
    } else {
      // Lógica para mostrar mensajes de error
    }
  }

  submitForm() {
    if (this.formStep2.valid && this.formStep1.valid) {
      // Aquí va la lógica para enviar el formulario
      console.log('Formulario enviado:', { ...this.formStep1.value, ...this.formStep2.value });
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
