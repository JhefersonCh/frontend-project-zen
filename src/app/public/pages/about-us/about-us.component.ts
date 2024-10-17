import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BasePageComponent } from "../../../shared/components/base-page/base-page.component";


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    BasePageComponent
],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  // Array de preguntas frecuentes
  preguntasFrecuentes = [
    {
      pregunta: '¿Cómo puedo registrarme en la plataforma?',
      respuesta: 'Para registrarte, haz clic en el botón "Registrarse" en la parte superior derecha de la página. Llena el formulario con tus datos y sigue las instrucciones.'
    },
    {
      pregunta: '¿Es gratis el uso de la plataforma?',
      respuesta: 'Sí, el uso básico de la plataforma es completamente gratuito. Sin embargo, ofrecemos planes premium con funciones adicionales.'
    },
    {
      pregunta: '¿Cómo puedo recuperar mi contraseña?',
      respuesta: 'Si olvidaste tu contraseña, puedes recuperarla haciendo clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y siguiendo los pasos indicados.'
    },
    {
      pregunta: '¿Cómo contacto con soporte?',
      respuesta: 'Puedes ponerte en contacto con nuestro equipo de soporte técnico a través del formulario de contacto o escribiendo a soporte@ejemplo.com.'
    }
  ];

  // Método para limpiar el texto y convertirlo en un ID válido
  generarId(pregunta: string): string {
    return pregunta.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(); // Reemplaza caracteres no válidos por guiones
  }
}