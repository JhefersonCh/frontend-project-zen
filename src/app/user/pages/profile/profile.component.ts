// import { UserService } from '../../../shared/services/user.service'; // Asegúrate de que esta ruta sea correcta
// //import { ProfileInterface } from '../../interfaces/profile.interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;

  // , private userService: UserService

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: [''],
      email: [''],
      phone: [''],
      avatarUrl: [''],
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.getUserProfile(); // Llama al método que usa UserService
  }

  getUserProfile(): void {
    // const userId = 'user-id'; // Reemplaza con el ID de usuario real
    // this.userService.getUserProfile(userId).subscribe({
    //   next: (response) => {
    //     this.profileForm.patchValue(response.data);
    //   },
    //   error: (err) => {
    //     console.error('Error al obtener el perfil del usuario:', err);
    //   }
    // });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveProfile();
    }
  }

  saveProfile(): void {
    if (this.isEditing) {
  //     const updatedUser: ProfileInterface = this.profileForm.value; // Asegúrate de que este tipo sea correcto
  //     this.userService.updateUserProfile(updatedUser).subscribe({
  //       next: () => {
  //         this.isEditing = false; // Salir del modo de edición
  //       },
  //       error: (err) => {
  //         console.error('Error al actualizar el perfil:', err);
  //       }
  //     });
  //   }
    }
    }
}
