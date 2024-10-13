import { Component, inject } from '@angular/core';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-yes-no-dialog',
  standalone: true,
  imports: [BaseDialogComponent, MatButtonModule],
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.scss'
})
export class YesNoDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<YesNoDialogComponent>);

  closeDialog(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }

  confirmAction(): void {
    this.closeDialog(true);
  }

  cancelAction(): void {
    this.closeDialog(false);
  }
}
