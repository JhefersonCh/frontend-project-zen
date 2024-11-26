import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { AreaOrLineChartComponent } from '../../../shared/components/area-or-line-chart/area-or-line-chart.component';
import { StackedAreaChartComponent } from '../../../shared/components/stacked-area-chart/stacked-area-chart.component';
import {
  AreaOrLineChartConfigInterface,
  StackedAreaChartConfigInterface
} from '../../../shared/interfaces/charts.interface';
import { MatTabsModule } from '@angular/material/tabs';
import {
  areaOrLineChartConfig as areaOrLineChartConfig,
  stackedAreaConfig
} from '../../constants/chartsConfigExample.const';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BasePageComponent,
    AreaOrLineChartComponent,
    StackedAreaChartComponent,
    MatTabsModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements AfterViewInit {
  selectedTabIndex = 0;
  reloadAllSizes: boolean = false;
  areaOrLineChartConfig: AreaOrLineChartConfigInterface = areaOrLineChartConfig;
  stackedAreaConfig: StackedAreaChartConfigInterface = stackedAreaConfig;
  @ViewChild(AreaOrLineChartComponent) areaChart!: AreaOrLineChartComponent;
  @ViewChild(StackedAreaChartComponent)
  stackedChart!: StackedAreaChartComponent;

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeAllCharts();
    });
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    setTimeout(() => {
      this.resizeAllCharts();
    }, 100);
  }

  private resizeAllCharts() {
    if (this.areaChart) {
      this.areaChart.resizeChart();
    }
    if (this.stackedChart) {
      this.stackedChart.resizeChart();
    }
  }
}
