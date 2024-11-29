import { EmptyPanelComponent } from './../../../shared/components/empty-panel/empty-panel.component';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import {
  barExampre,
  polarExample
} from '../../constants/chartsConfigExample.const';
import { ChartOptions } from '../../../shared/interfaces/charts.interface';
import { BarChartComponent } from '../../../shared/components/bar-chart/bar-chart.component';
import { PolarChartComponent } from '../../../shared/components/polar-chart/polar-chart.component';
import { ReportsService } from '../../services/reports.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BasePageComponent,
    MatTabsModule,
    BarChartComponent,
    PolarChartComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    EmptyPanelComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  @ViewChild(BarChartComponent) barChart!: BarChartComponent;
  @ViewChild(PolarChartComponent) polarChart!: PolarChartComponent;
  selectedTabIndex = 0;
  reloadAllSizes: boolean = false;
  selectedTab: string = 'Proyectos';
  public chartOptions: Partial<ChartOptions> = barExampre;
  public polarChartOptions: Partial<ChartOptions> = polarExample;

  projectsTime?: Partial<ChartOptions>;

  private readonly _reportsService: ReportsService = inject(ReportsService);

  onTabChange(tab: MatTabChangeEvent) {
    this.selectedTabIndex = tab.index;
    this.selectedTab = tab.tab.textLabel;
  }

  ngOnInit(): void {
    this._getProjectsReports();
  }

  private _getProjectsReports(): void {
    const startDate = new Date('2024-01-01').toDateString();
    const endDate = new Date('2024-12-31').toDateString();
    this._reportsService
      .getProjectsTimeReport({ startDate, endDate })
      .subscribe({
        next: (res) => {
          if (res && res.time) {
            this.projectsTime = res.time as Partial<ChartOptions>;
          }
        },
        error: (err) => {
          console.error('Error obteniendo reportes', err);
        }
      });
  }
}
