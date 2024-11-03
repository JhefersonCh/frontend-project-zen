import { Component, inject } from '@angular/core';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationsService } from '../../../shared/utilities/translations.service';
import { Element } from '../../interfaces/admin-panel.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-or-update-panel-element',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-or-update-panel-element.component.html',
  styleUrl: './create-or-update-panel-element.component.scss'
})
export class CreateOrUpdatePanelElementComponent {
  private _dialogRef: MatDialogRef<CreateOrUpdatePanelElementComponent> =
    inject(MatDialogRef<CreateOrUpdatePanelElementComponent>);
  private _translationsService: TranslationsService =
    inject(TranslationsService);
  public data = inject<{ elementType: string; elementData?: Element }>(
    MAT_DIALOG_DATA
  );
  form!: FormGroup;
  private readonly _fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.form = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  close(): void {
    this._dialogRef.close();
  }

  getTraduction(key: string): string {
    return this._translationsService.getTranslation(key);
  }

  save(): void {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
    this._dialogRef.close(this.form.value);
  }
}
