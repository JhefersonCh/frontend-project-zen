import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { AdminPanelService } from '../../users/services/adminPanel.service';
import { finalize } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AdminPanelElementInterface } from '../../interfaces/admin-panel.interface';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslationsService } from '../../../shared/utilities/translations.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrUpdatePanelElementComponent } from '../../components/create-or-update-panel-element/create-or-update-panel-element.component';

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
  private readonly _adminPanelService: AdminPanelService =
    inject(AdminPanelService);
  private readonly _translationsService: TranslationsService =
    inject(TranslationsService);
  private readonly _matDialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    this._getAdminPanelInfo();
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

  openCreateElementDialog(element: string): void {
    const dialogRef = this._matDialog.open(
      CreateOrUpdatePanelElementComponent,
      {
        data: { element }
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this._createElement(element, res);
      }
    });
  }

  private _createElement(element: string, body: object): void {
    this._adminPanelService.createElement(body, element).subscribe({
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
