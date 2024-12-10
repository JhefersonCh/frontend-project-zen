import { Component, inject } from '@angular/core';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomValidationsService } from '../../../shared/validators/customValidations.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    BasePageComponent,
    MatIcon,
    LoaderComponent,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTab,
    MatTabGroup
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
  userId: string = '';
  user?: UserInterface;
  pageLoading: boolean = true;
  isLoading = true;
  form: FormGroup;
  changePasswordForm: FormGroup;
  passwordMismatch = false;
  eyeOpen = faEye;
  eyeClose = faEyeSlash;
  showOldPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  selectedTabIndex: number = 0;

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _userService: UserService = inject(UserService);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);
  private readonly _customValidations: CustomValidationsService = inject(
    CustomValidationsService
  );
  private readonly _passwordValidationService: CustomValidationsService =
    inject(CustomValidationsService);

  /**
   * Se recibe la información diligenciada en el formulario.
   * @param constructor - Formulario de como va a llegar la data del usuario.
   * @param constructor - Creación del formulario.
   * @param oldPassword - Formulario 1 de información personal.
   * @param passwordStrength - Válida que la contraseña poseea más de 6 carácteres, 1 minúscula, 1 mayúscula y 1 carácter especial.
   * @param passwordsMatch - Válida que la contraseña sea igual a confirmar contraseña.
   */
  constructor() {
    this.form = this._fb.group({
      fullName: [''],
      identification: [''],
      username: [''],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern('^3\\d{9}$')]],
      avatarUrl: [''],
      roleId: [''],
      identificationTypeId: ['']
    });

    this.changePasswordForm = this._fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            this._passwordValidationService.passwordStrength()
          ]
        ],
        confirmNewPassword: ['', Validators.required]
      },
      {
        validators: this._customValidations.passwordsMatch(
          'newPassword',
          'confirmNewPassword'
        )
      }
    );
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  /**
   * @param ngOnInit - Inicializa las funciones.
   */
  ngOnInit(): void {
    this.userId = this._activatedRoute.snapshot.params?.['id'];
    this.getUserData(this.userId);
  }

  /**
   * @param getUserData - Obtiene los datos del usuario.
   */
  getUserData(userId: string): void {
    this._userService.getUserProfile(userId).subscribe({
      next: (response) => {
        this.user = response?.data;
        this.pageLoading = false;
        this.updateFormData();
      },
      error: (error) => {
        console.error('Error al encontrar el usuario', error);
      }
    });
  }

  /**
   * @param updateFormData - Actualiza los datos del formulario.
   */
  updateFormData(): void {
    this.form?.patchValue({
      fullName: this.user?.fullName,
      identification: this.user?.identification,
      username: this.user?.username,
      email: this.user?.email,
      phone: this.user?.phone,
      avatarUrl: this.user?.avatarUrl
    });
  }

  /**
   * @param saveInfo - Guarda la información del usuario.
   */
  saveInfo(): void {
    const userUpdate = {
      username: this.form.get('username')?.value,
      fullName: this.form.get('fullName')?.value,
      phone: Number(this.form.get('phone')?.value),
      avatarUrl: this.form.get('avatarUrl')?.value
    };

    if (this.form.invalid) return;
    this._userService.updateUserProfile(this.userId, userUpdate).subscribe({
      next: () => {
        this._router.navigate(['../../profile']);
      },
      error: (error) => {
        console.error('Error al actualizar el usuario', error);
      }
    });
  }

  /**
   * @param onChangePassword - Trae la contraseña antigua y cambia las contraseñas nuevas.
   */
  onChangePassword(): void {
    const { oldPassword, newPassword, confirmNewPassword } =
      this.changePasswordForm.value;

    if (newPassword !== confirmNewPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    this._userService
      .updateUserPassword({
        oldPassword,
        newPassword,
        confirmNewPassword
      })
      .subscribe({
        next: () => {
          this._router.navigate(['/profile']);
          this.changePasswordForm.reset();
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
        }
      });
  }

  /**
   * @param toggleOldPasswordVisibility - Ver antigua contraseña.
   */
  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
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
