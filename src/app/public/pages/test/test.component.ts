import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-test',
  templateUrl: './test.component.html',
  imports: [
    // FormBuilder,
    // FormGroup,
    // Validators,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,

  ],
  styleUrls: ['./test.component.css'] // Ajusta el nombre del archivo según sea necesario
})
export class TestComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: true }, Validators.required],
      avatarUrl: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }, Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
