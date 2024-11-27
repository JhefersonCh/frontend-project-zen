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
  selector: 'app-polar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './polar-chart.component.html',
  styleUrl: './polar-chart.component.scss'
})
export class PolarChartComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  @Input() chartOptions!: Partial<ChartOptions>;
  private resizeObserver: ResizeObserver | undefined;

  isMobile: boolean = false;

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      const width = await this.waitForContainerWidth();
      if (width > 0) {
        this.initializeChart();
      }

      // Observe changes in the container's size
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartContainer) {
          this.handleResize();
        }
      });

      this.resizeObserver.observe(this.chartContainer.nativeElement);

      // Handle window resizing
      window.addEventListener('resize', this.handleResize);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.chart.destroy();
    window.removeEventListener('resize', this.handleResize);
  }

  private async waitForContainerWidth(): Promise<number> {
    let attempts = 0;
    while (attempts < 10) {
      const containerWidth = this.getContainerWidth();
      if (containerWidth > 0) {
        return containerWidth;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100 ms
    }
    return 400; // Default value if container width is not available
  }

  private getContainerWidth(): number {
    const containerWidth = this.chartContainer?.nativeElement?.offsetWidth;
    if (!containerWidth) {
      return 0;
    }
    return containerWidth;
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
        show: this.isMobile ? false : true
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
              show: this.isMobile ? false : true
            }
          }
        }
      ]
    };
  }

  private handleResize = () => {
    const containerWidth = this.getContainerWidth();
    if (containerWidth > 0 && this.chartOptions.chart) {
      this.chartOptions.chart = {
        ...this.chartOptions.chart,
        width: containerWidth,
        type: 'polarArea'
      };
    }
  };
}
