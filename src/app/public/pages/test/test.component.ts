/* eslint-disable @typescript-eslint/no-unused-expressions */
// test.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TestService } from '../../services/test.service';
import { UserInterface } from '../../interfaces/test.interface';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    DatePipe
  ],
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  isEditing: boolean = false;
  user?: UserInterface;

  private readonly _testService: TestService = inject(TestService);
  private readonly _localStorageService: LocalStorageService =
    inject(LocalStorageService);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId: string =
      this._localStorageService.getAllSessionData()?.user?.id;

    userId &&
      this._testService.getUserProfile(userId).subscribe({
        next: (response) => {
          this.user = response?.data;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  editProfile(): void {
    this.isEditing = !this.isEditing;
    console.log(this.isEditing ? 'Editing profile' : 'Editing canceled');
    // Aquí puedes habilitar o deshabilitar los campos de edición según isEditing
  }
}
