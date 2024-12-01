import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  Input
} from '@angular/core';
import { ChartOptions } from '../../interfaces/charts.interface';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('chart') chart!: ChartComponent;

  @Input() chartOptions: Partial<ChartOptions> = {};
  @Input() chartId: string = 'chart-' + Math.random().toString(36).substr(2, 9);
  @Input() title: string = '';
  private resizeObserver: ResizeObserver | undefined;

  ngAfterViewInit(): void {
    setTimeout(async () => {
      const width = await this.waitForContainerWidth();
      if (width > 0) {
        this.initializeChart();
      }

      // Observa cambios en el tamaño del contenedor
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartContainer) {
          this.handleResize();
        }
      });

      this.resizeObserver.observe(this.chartContainer.nativeElement);

      window.addEventListener('resize', this.handleResize);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.handleResize);
    console.log();
  }

  private async waitForContainerWidth(): Promise<number> {
    let attempts = 0;
    while (attempts < 10) {
      const containerWidth = this.getContainerWidth();
      if (containerWidth > 0) {
        return containerWidth;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return 400;
  }

  private getContainerWidth(): number {
    const containerWidth = this.chartContainer?.nativeElement?.offsetWidth;
    if (!containerWidth) {
      return 0;
    }
    return containerWidth;
  }

  private initializeChart(): void {
    const defaultOptions: Partial<ChartOptions> = {
      chart: {
        id: this.chartId,
        type: 'bar',
        width: this.getContainerWidth(),
        height: 400,
        animations: {
          enabled: true
        },
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        show: false
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      }
    };

    this.chartOptions = {
      ...defaultOptions,
      ...this.chartOptions,
      chart: {
        ...defaultOptions.chart,
        ...this.chartOptions.chart,
        type: 'bar'
      }
    };
  }

  private handleResize = () => {
    const containerWidth = this.getContainerWidth();
    if (containerWidth > 0 && this.chartOptions.chart) {
      this.chartOptions.chart = {
        ...this.chartOptions.chart,
        width: containerWidth,
        type: 'bar'
      };
    }
  };
}
