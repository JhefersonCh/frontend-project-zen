import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    BasePageComponent,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent {
  faqs = [
    {
      pregunta: '¿Cómo puedo registrarme en la plataforma?',
      respuesta:
        'Para registrarte, haz clic en el botón "Registrarse" en la parte superior derecha de la página. Llena el formulario con tus datos y sigue las instrucciones.'
    },
    {
      pregunta: '¿Es gratis el uso de la plataforma?',
      respuesta:
        'Sí, el uso básico de la plataforma es completamente gratuito. Sin embargo, ofrecemos planes premium con funciones adicionales.'
    },
    {
      pregunta: '¿Cómo puedo recuperar mi contraseña?',
      respuesta:
        'Si olvidaste tu contraseña, puedes recuperarla haciendo clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y siguiendo los pasos indicados.'
    },
    {
      pregunta: '¿Cómo contacto con soporte?',
      respuesta:
        'Puedes ponerte en contacto con nuestro equipo de soporte técnico a través del formulario de contacto o escribiendo a soporte@ejemplo.com.'
    }
  ];
  form: FormGroup;
  private readonly _fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.form = this._fb.group({
      email: ['', Validators.required],
      name: [''],
      message: ['', Validators.required]
    });
  }

  sendPqrs(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();
  }
}
