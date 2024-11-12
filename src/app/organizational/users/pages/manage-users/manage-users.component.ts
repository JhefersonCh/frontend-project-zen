import { UserService as UsersSharedService } from '../../../../shared/services/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';
import { CommonModule, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import * as uuid from 'uuid';
import { UsersService } from '../../services/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterUserInterface } from '../../../../auth/interfaces/register.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from '../../../../shared/interfaces/user.interface';
import { IdentificationType } from '../../interfaces/users.interface';
import { Roles } from '../../../../auth/interfaces/login.interface';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    BasePageComponent,
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
export class ManageUserComponent implements OnInit {
  userForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  userId: string = '';
  user?: UserInterface;
  identificationTypes: IdentificationType[] = [];
  roles: Roles[] = [];
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _usersSharedService: UsersSharedService =
    inject(UsersSharedService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);

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

  ngOnInit(): void {
    this.loadRelatedData();
    this.userId = this._activatedRoute.snapshot.params['id'];
    if (this.userId) this._getUserToEdit(this.userId);
  }

  loadRelatedData(): void {
    this._usersService.createUsersRelatedData().subscribe({
      next: (response) => {
        this.identificationTypes = response.data.identificationTypes;
        this.roles = response.data.roles;
      },
      error: (error) =>
        console.error('Error al cargar datos relacionados:', error)
    });
  }

  private _getUserToEdit(userId: string): void {
    console.log(userId);

    this._usersSharedService.getUserProfile(userId).subscribe({
      next: (res) => {
        this.user = res.data;
        this._patchForm(this.user);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          console.error('Error al obtener usuario:', err.error.message);
        } else {
          console.error('Error al obtener usuario:', err);
        }
      }
    });
  }

  private _patchForm(user: UserInterface) {
    this.userForm.patchValue(user);
    this.setPassword();
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
        id: this.userId || uuid.v4(),
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

      if (this.userId) {
        console.log(userToRegister);
      } else {
        this._usersService.createUser(userToRegister).subscribe({
          next: () => {
            this._router.navigate(['../list']);
          },
          error: (err) => {
            if (err.error && err.error.message) {
              console.error('Error al registrar usuario:', err.error.message);
            } else {
              console.error('Error desconocido:', err);
            }
          }
        });
      }
    } else {
      console.error('Formulario no válido', this.userForm.errors);
    }
  }
}
