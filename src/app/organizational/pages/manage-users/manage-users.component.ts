import { Component, inject } from '@angular/core';
import { BasePageComponent } from "../../../shared/components/base-page/base-page.component";
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from 'express';
import * as uuid from 'uuid';
import { UsersService } from '../../../users/services/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class CreateUserComponent {

  userForm: FormGroup;

  private readonly _usersService: UsersService = inject(UsersService);
  // private readonly _router: Router = inject(Router);

  identificationTypes: { type: string; id: number }[] = [
    { type: 'Cédula de ciudadanía', id: 1 },
    { type: 'Tarjeta de Identidad', id: 2 },
    { type: 'Pasaporte', id: 3 },
    { type: 'Cédula de extrangería', id: 4 }
  ];

  rol = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Subadmin' },
    { id: 3, name: 'Usuario Normal' }
  ];


  constructor(private _fb: FormBuilder){
    this.userForm = this._fb.group({
      fullName: ['',Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      identification: ['', Validators.required],
      identificationTypeId: [1, Validators.required],
      avatarUrl: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [1, Validators.required]
    });
  }



  submitForm() {
    if (this.userForm) {
      const userToRegisterRol: UsersService = {
        id: uuid.v4(),
        identificationTypeId: 1,
        roleId: this.userForm.value.roleId,
        identification: this.userForm.value.identification,
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        passwordConfirmation: this.userForm.get('confirmPassword')?.value,
        avatarUrl: this.userForm.value.avatarUrl,
      };
      this._usersService.registerUserRole(userToRegisterRol).subscribe({

      });
    } else {
      // Muestra errores si uno de los formularios no es válido
    }
  }// Maneja la acción de guardar


}
