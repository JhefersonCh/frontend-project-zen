import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject } from '@angular/core';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Members, ProjectRoles } from '../../interfaces/projects.interface';
import { MatSelectModule } from '@angular/material/select';
import { UserInterface } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-add-or-edit-members',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './add-or-edit-members.component.html',
  styleUrl: './add-or-edit-members.component.scss'
})
export class AddOrEditMembersComponent {
  private readonly _dialogRef = inject(MatDialogRef<AddOrEditMembersComponent>);
  public readonly data = inject<{ member?: Members; projectId?: number }>(
    MAT_DIALOG_DATA
  );
  form: FormGroup;
  users: UserInterface[] = [];
  projectRoles: ProjectRoles[] = [];

  constructor(private readonly _fb: FormBuilder) {
    this.form = this._fb.group({
      userId: [this.data?.member?.userId, [Validators.required]],
      projectRoleId: [this.data?.member?.projectRoleId, [Validators.required]],
      projectId: [this.data?.projectId]
    });
  }

  closeDialog(): void {
    this._dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
  }
}
