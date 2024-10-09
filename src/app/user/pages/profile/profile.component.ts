import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    // FormBuilder,
    // FormGroup,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,

  ],
  styleUrls: ['./profile.component.css'] // Ajusta el nombre del archivo según sea necesario
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      avatarUrl: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // // Simulación de carga de datos del usuario
    // this.userService.getUserProfile().subscribe(user => {
    //   this.profileForm.patchValue(user);
    // });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable(); // Habilita el formulario para editar
    } else {
      this.profileForm.disable(); // Deshabilita el formulario
      this.loadUserProfile(); // Vuelve a cargar los datos originales
    }
  }

  saveProfile(): void {
    // if (this.profileForm.valid) {
    //   const formValues = this.profileForm.value;
    //   // Aquí puedes enviar los datos actualizados a tu servicio
    //   this.userService.updateUserProfile(formValues).subscribe(response => {
    //     // Maneja la respuesta aquí
    //     console.log('Perfil actualizado', response);
    //     this.isEditing = false; // Desactiva la edición
    //     this.profileForm.disable(); // Deshabilita el formulario
    //   });
    // } else {
    //   console.log('Formulario inválido');
    // }
  }
}
