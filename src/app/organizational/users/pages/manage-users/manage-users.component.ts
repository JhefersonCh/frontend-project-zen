import { Component, inject } from '@angular/core';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';
import { BaseCardComponent } from '../../../../shared/components/base-card/base-card.component';
import { CommonModule, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
// import { Router } from 'express';
import * as uuid from 'uuid';
import { UsersService } from '../../services/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterUserInterface } from '../../../../auth/interfaces/register.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    BasePageComponent,
    BaseCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgFor,
    MatButtonModule,
    FontAwesomeModule,
    MatIcon
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUserComponent {
  userForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private readonly _usersService: UsersService = inject(UsersService);
  // private readonly _router: Router = inject(Router);

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

  constructor(private _fb: FormBuilder) {
    this.userForm = this._fb.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      identification: ['', Validators.required],
      identificationTypeId: ['', Validators.required],
      avatarUrl: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: [
        '',
        [Validators.required, Validators.minLength(6)]
      ],
      roleId: ['', Validators.required]
    });
  }

  setPassword() {
    const identificationValue = this.userForm.get('identification')?.value;
    if (identificationValue) {
      this.userForm.patchValue({
        password: identificationValue,
        passwordConfirmation: identificationValue
      });
    }
  }

  save() {
    if (this.userForm.valid) {
      const userToRegister: RegisterUserInterface = {
        id: uuid.v4(),
        identification: this.userForm.value.identification,
        identificationTypeId: this.userForm.value.identificationTypeId,
        fullName: this.userForm.value.fullName,
        avatarUrl: this.userForm.value.avatarUrl || '',
        username: this.userForm.value.username,
        phone: this.userForm.value.phone,
        email: this.userForm.value.email,
        password: this.userForm.value.identification,
        passwordConfirmation: this.userForm.value.identification,
        roleId: this.userForm.value.roleId
      };

      this._usersService.createUser(userToRegister).subscribe({
        next: () => {
          // Redirecciona al dashboard de usuarios
          // this._router.navigate(['/dashboard/users']);
        },
        error: (err) => {
          // Manejo de errores más específico
          if (err.error && err.error.message) {
            console.error('Error al registrar usuario:', err.error.message);
          } else {
            console.error('Error desconocido:', err);
          }
        }
      });
    } else {
      console.error('Formulario no válido', this.userForm.errors);
    }
  }
}
