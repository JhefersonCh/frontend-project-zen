import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../interfaces/charts.interface';

@Component({
  selector: 'app-polar-chart-percent',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './polar-chart-percent.component.html',
  styleUrl: './polar-chart-percent.component.scss'
})
export class PolarChartPercentComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() chartData!: {
    series: string[];
    labels: string[];
    title: {
      text: string;
      align: string;
      margin: number;
      style: { fontSize: string };
    };
  };

  chartOptions: Partial<ChartOptions> = {};
  @Input() title: string = '';
  private resizeObserver: ResizeObserver | undefined;
  isMobile: boolean = false;

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.processChartData();
  }

  private processChartData(): void {
    const processedSeries = this.chartData.series.map((fraction) => {
      const [numerator, denominator] = fraction
        .split('/')
        .map((num) => parseFloat(num.trim()));
      return (numerator / denominator) * 100;
    });

    this.chartOptions = {
      series: processedSeries,
      labels: this.chartData.labels,
      tooltip: {
        y: {
          formatter: (value, { seriesIndex }) => {
            return `${this.chartData.series[seriesIndex]} (${value.toFixed(1)}%)`;
          }
        }
      }
    };
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      const width = await this.waitForContainerWidth();
      if (width > 0) {
        this.initializeChart();
      }

      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartContainer) {
          this.handleResize();
        }
      });

      this.resizeObserver.observe(this.chartContainer.nativeElement);
      window.addEventListener('resize', this.handleResize);
    });
  }

  private async waitForContainerWidth(): Promise<number> {
    let attempts = 0;
    while (attempts < 10) {
      const containerWidth = this.getContainerWidth();
      if (containerWidth > 0) return containerWidth;
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return 400;
  }

  private getContainerWidth(): number {
    return this.chartContainer?.nativeElement?.offsetWidth || 0;
  }

  private initializeChart(): void {
    const containerWidth = this.getContainerWidth();
    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        type: 'polarArea',
        width: containerWidth > 0 ? containerWidth : 400,
        height: 600
      },
      stroke: {
        colors: ['#fff']
      },
      fill: {
        opacity: 0.8
      },
      legend: {
        position: 'right',
        show: !this.isMobile
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom',
              show: false
            }
          }
        }
      ]
    };
  }

  private handleResize = (): void => {
    const containerWidth = this.getContainerWidth();
    if (containerWidth > 0 && this.chartOptions.chart) {
      this.chartOptions.chart = {
        ...this.chartOptions.chart,
        width: containerWidth,
        type: 'polarArea'
      };
    }
  };

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.chart.destroy();
    window.removeEventListener('resize', this.handleResize);
  }
}
