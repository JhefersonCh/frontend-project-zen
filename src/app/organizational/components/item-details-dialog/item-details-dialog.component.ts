import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SearchResult } from '../../../shared/interfaces/search.interface';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-item-details-dialog',
  standalone: true,
  imports: [BaseDialogComponent, MatButtonModule, DatePipe],
  templateUrl: './item-details-dialog.component.html',
  styleUrl: './item-details-dialog.component.scss'
})
export class ItemDetailsDialogComponent {
  private _dialogRef = inject(MatDialogRef<ItemDetailsDialogComponent>);
  public data: { item: SearchResult } = inject(MAT_DIALOG_DATA);

  public closeDialog(): void {
    this._dialogRef.close();
  }

  private readonly _sanitizer: DomSanitizer = inject(DomSanitizer);

  sanitizeHtmlContent(content: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(content);
  }
}
