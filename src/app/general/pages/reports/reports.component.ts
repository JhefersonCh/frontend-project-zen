import { Component, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import {
  barExampre,
  polarExample
} from '../../constants/chartsConfigExample.const';
import { ChartOptions } from '../../../shared/interfaces/charts.interface';
import { BarChartComponent } from '../../../shared/components/bar-chart/bar-chart.component';
import { PolarChartComponent } from '../../../shared/components/polar-chart/polar-chart.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BasePageComponent,
    MatTabsModule,
    BarChartComponent,
    PolarChartComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  @ViewChild(BarChartComponent) barChart!: BarChartComponent;
  @ViewChild(PolarChartComponent) polarChart!: PolarChartComponent;
  selectedTabIndex = 0;
  reloadAllSizes: boolean = false;
  selectedTab: string = 'Proyectos';
  public chartOptions: Partial<ChartOptions> = barExampre;
  public polarChartOptions: Partial<ChartOptions> = polarExample;

  onTabChange(tab: MatTabChangeEvent) {
    this.selectedTabIndex = tab.index;
    this.selectedTab = tab.tab.textLabel;
  }
}
