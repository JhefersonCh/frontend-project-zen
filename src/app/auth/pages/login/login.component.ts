import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa Router
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, // Asegúrate de que sea standalone
  imports: [ReactiveFormsModule, RouterModule, MatIconModule] // Agrega RouterModule aquí
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  // Inyecta Router en el constructor
  constructor(private fb: FormBuilder, private router: Router) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      
      // Navega a la ruta 'home-auth' después del login exitoso
      this.router.navigate(['/home-auth']);
    }
  }
}
