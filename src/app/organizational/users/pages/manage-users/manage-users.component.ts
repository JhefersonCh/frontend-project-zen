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
    MatButtonModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUserComponent {
  userForm: FormGroup;

  private readonly _usersService: UsersService = inject(UsersService);
  // private readonly _router: Router = inject(Router);

  identificationTypes: { type: string; id: number }[] = [
    { type: 'Cédula de ciudadanía', id: 1 },
    { type: 'Tarjeta de Identidad', id: 2 },
    { type: 'Pasaporte', id: 3 },
    { type: 'Cédula de extrangería', id: 4 }
  ];

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Subadmin' },
    { id: 3, name: 'Usuario Normal' }
  ];

  constructor(private _fb: FormBuilder) {
    this.userForm = this._fb.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      identification: ['', Validators.required],
      identificationTypeId: ['', Validators.required],
      avatarUrl: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: [
        '',
        [Validators.required, Validators.minLength(6)]
      ],
      roleId: [1, Validators.required]
    });
  }

  submitForm() {
    if (this.userForm) {
      const userToRegisterRol: RegisterUserInterface = {
        id: uuid.v4(),
        identificationTypeId: this.userForm.value.identificationTypeId,
        roleId: this.userForm.value.roleId,
        identification: this.userForm.value.identification,
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        username: this.userForm.value.username,
        password: this.userForm.value.identification,
        avatarUrl: this.userForm.value.avatarUrl
      };
      this._usersService.createUser(userToRegisterRol).subscribe({
        next: () => {
          // Redirecciona al dashboard de usuarios
          // this._router.navigate(['/dashboard/users']);
        },
        error: () => {
          // Muestra los errores en caso de que el registro falle
        }
      });
    } else {
      // Muestra errores si uno de los formularios no es válido
    }
  } // Maneja la acción de guardar
}
