import { Component, inject, OnInit } from '@angular/core';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationsService } from '../../../shared/utilities/translations.service';
import { ElementType } from '../../interfaces/admin-panel.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { elements } from '../../constants/admin-panel.constant';
import { FormFieldSuccessDirective } from '../../../shared/directives/form-field-success.directive';

interface FieldConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: [any, ValidationErrors?];
  type: string;
}

type FormFieldsOptions = Record<string, Record<string, FieldConfig>>;

@Component({
  selector: 'app-create-or-update-panel-element',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormFieldSuccessDirective
  ],
  templateUrl: './create-or-update-panel-element.component.html',
  styleUrl: './create-or-update-panel-element.component.scss'
})
export class CreateOrUpdatePanelElementComponent implements OnInit {
  private _dialogRef: MatDialogRef<CreateOrUpdatePanelElementComponent> =
    inject(MatDialogRef<CreateOrUpdatePanelElementComponent>);
  private _translationsService: TranslationsService =
    inject(TranslationsService);
  public data = inject<{ elementType: string; elementData?: ElementType }>(
    MAT_DIALOG_DATA
  );
  formTest!: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldType!: Record<string, FieldConfig>;

  private readonly _elements = elements;
  private readonly _fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formTest = this._fb.group({});
  }

  ngOnInit(): void {
    this._createFormFields();
  }

  private _createFormFields(): void {
    const formFieldsOptions: FormFieldsOptions = {
      default: {
        title: {
          control: ['', [Validators.required]],
          type: 'input'
        }
      },
      identificationType: {
        type: {
          control: ['', [Validators.required]],
          type: 'input'
        },
        code: {
          control: ['', [Validators.required, Validators.maxLength(3)]],
          type: 'input'
        }
      },
      projectRole: {
        roleName: {
          control: ['', [Validators.required]],
          type: 'input'
        },
        description: {
          control: ['', [Validators.required]],
          type: 'textArea'
        }
      },
      category: {
        title: {
          control: ['', [Validators.required]],
          type: 'input'
        },
        description: {
          control: ['', [Validators.required]],
          type: 'textArea'
        }
      }
    };

    this.fieldType =
      formFieldsOptions[this._elements[this.data.elementType]] ||
      formFieldsOptions['default'];

    Object.keys(this.fieldType).forEach((field) => {
      const controlConfig =
        this.fieldType[field as keyof typeof this.fieldType].control;
      if (controlConfig) {
        this.formTest.addControl(field, this._fb.control(...controlConfig));
      }
    });

    if (this.data.elementData) {
      this.formTest.patchValue(this.data.elementData);
    }
  }

  getObjectKeys(obj: object) {
    return Object.keys(obj);
  }

  get formControlEntries(): AbstractControl[] {
    return Object.values(this.formTest.controls);
  }

  close(): void {
    this._dialogRef.close();
  }

  getTraduction(key: string): string {
    return this._translationsService.getTranslation(key);
  }

  save(): void {
    if (this.formTest.invalid) {
      return this.formTest.markAllAsTouched();
    }
    this._dialogRef.close(this.formTest.value);
  }
}
