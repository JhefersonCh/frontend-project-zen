import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BasePageComponent,
    MatIcon,
    LoaderComponent
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  userId: string = '';
  user?: UserInterface;
  pageLoading: boolean = true;
  isLoading = true;

  form: FormGroup;

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _userService: UserService = inject(UserService);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _router: Router = inject(Router);

  constructor() {
    this.form = this._fb.group({
      fullName: [''],
      identification: [''],
      username: [''],
      email: [''],
      phone: [''],
      avatarUrl: [''],
      roleId: [''],
      identificationTypeId: ['']
    });
  }
  ngOnInit(): void {
    this.userId = this._activatedRoute.snapshot.params?.['id'];
    this.getUserData(this.userId);
  }

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
}
