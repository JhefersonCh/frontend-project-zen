import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { AdminPanelService } from '../../users/services/adminPanel.service';
import { finalize } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import {
  AdminPanelElementInterface,
  ElementType
} from '../../interfaces/admin-panel.interface';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslationsService } from '../../../shared/utilities/translations.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrUpdatePanelElementComponent } from '../../components/create-or-update-panel-element/create-or-update-panel-element.component';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    BasePageComponent,
    LoaderComponent,
    BaseCardComponent,
    MatTabsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  loadingPage: boolean = true;
  panelDataObj!: AdminPanelElementInterface;
  selectedTabIndex = 0;
  private readonly _adminPanelService: AdminPanelService =
    inject(AdminPanelService);
  private readonly _translationsService: TranslationsService =
    inject(TranslationsService);
  private readonly _matDialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    this._getAdminPanelInfo();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  private _getAdminPanelInfo(): void {
    this.loadingPage = true;
    this._adminPanelService
      .getAdminPanelInfo()
      .pipe(finalize(() => (this.loadingPage = false)))
      .subscribe({
        next: (res) => {
          this.panelDataObj = res.data;
        }
      });
  }

  openCreateElementDialog(
    elementType: string,
    elementData?: ElementType
  ): void {
    const dialogRef = this._matDialog.open(
      CreateOrUpdatePanelElementComponent,
      {
        data: { elementType, elementData }
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const id = elementData?.id;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !elementData
          ? this._createElement(elementType, res)
          : this._updateElement(elementType, { ...res, id });
      }
    });
  }

  private _deleteElement(elementType: string, id: number): void {
    this._adminPanelService.deleteElement(id, elementType).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this._getAdminPanelInfo();
        }
      }
    });
  }

  openDeleteElementDialog(elementType: string, id: number): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this._deleteElement(elementType, id);
      }
    });
  }

  private _createElement(element: string, body: object): void {
    this._adminPanelService.createElement(body, element).subscribe({
      next: () => {
        this._getAdminPanelInfo();
      }
    });
  }

  private _updateElement(element: string, body: object): void {
    this._adminPanelService.updateElement(body, element).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this._getAdminPanelInfo();
        }
      }
    });
  }

  get panelElementsMapEntries() {
    return Object.entries(this.panelDataObj);
  }

  translateLabels(label: string): string {
    return this._translationsService.getTranslation(label);
  }
}
