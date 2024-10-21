import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject, OnInit } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MembersService } from '../../services/members.service';
import { UsersService } from '../../../users/services/users.service';
import { UsersInterface } from '../../../users/interfaces/users.interface';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-add-or-edit-members',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './add-or-edit-members.component.html',
  styleUrl: './add-or-edit-members.component.scss'
})
export class AddOrEditMembersComponent implements OnInit {
  private readonly _membersService: MembersService = inject(MembersService);
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _dialogRef = inject(MatDialogRef<AddOrEditMembersComponent>);
  public readonly data = inject<{ member?: Members; projectId?: number }>(
    MAT_DIALOG_DATA
  );
  form: FormGroup;
  users: UsersInterface[] = [];
  projectRoles: ProjectRoles[] = [];

  constructor(private readonly _fb: FormBuilder) {
    this.form = this._fb.group({
      user: [this.data?.member?.user, [Validators.required]],
      projectRoleId: [this.data?.member?.projectRoleId, [Validators.required]],
      projectId: [this.data?.projectId]
    });
  }

  ngOnInit(): void {
    this._getRelatedData();
    this._getUsersWithPagination('');
    this._listenForm();
  }

  private _listenForm(): void {
    this.form
      .get('user')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((user) => {
        if (user) {
          this._getUsersWithPagination(
            typeof user === 'string' ? user : user?.fullName
          );
        } else {
          this._getUsersWithPagination('');
        }
      });
  }

  fullName(user: UsersInterface): string {
    return user ? user.fullName : '';
  }

  private _getRelatedData(): void {
    this._membersService.getRelatedData().subscribe({
      next: (res) => {
        this.projectRoles = res?.data?.projectRoles || [];
      },
      error: (error) => console.error(error)
    });
  }

  private _getUsersWithPagination(search: string): void {
    console.log(search);

    this._usersService.getUserWithPagination({ search }).subscribe({
      next: (res) => {
        this.users = res?.data || [];
      }
    });
  }

  closeDialog(): void {
    this._dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    const member = {
      projectId: Number(this.data?.projectId),
      projectRoleId: Number(this.form.value?.projectRoleId),
      userId: this.form.value?.user?.id
    };

    if (!this.data.member?.id) {
      this._membersService.createMember(member).subscribe({
        next: () => {
          this._dialogRef.close(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      const updatedMember = {
        ...member,
        id: this.data.member.id
      };

      this._membersService.updateMember(updatedMember).subscribe({
        next: () => {
          this._dialogRef.close(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
