/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { AreaOrLineChartConfigInterface } from '../../interfaces/charts.interface';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

@Component({
  selector: 'app-area-or-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './area-or-line-chart.component.html',
  styleUrl: './area-or-line-chart.component.scss'
})
export class AreaOrLineChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() chartConfig!: AreaOrLineChartConfigInterface;

  private chart!: IChartApi;
  series!: ISeriesApi<any>;

  private toolTip!: HTMLDivElement;
  private readonly TOOLTIP_WIDTH = 150;
  private readonly TOOLTIP_HEIGHT = 80;
  private readonly TOOLTIP_MARGIN = 15;

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeChart();
      this.series = this.createSeries();
      this.createTooltip();
      this.setChartData();
      this.chart.timeScale().fitContent();
    });
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chart) {
        this.chart.applyOptions({
          width: this.chartContainer.nativeElement.offsetWidth
        });
        this.chart.timeScale().fitContent();
      }
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);

    window.addEventListener('resize', this.handleResize);
  }

  private initializeChart(): void {
    const { chartOptions } = this.chartConfig;

    this.chart = createChart(this.chartContainer.nativeElement, {
      height: chartOptions?.height || 300,
      layout: {
        textColor: chartOptions?.textColor || 'black',
        background: { color: chartOptions?.backgroundColor || 'white' }
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false
        },
        vertLine: {
          labelVisible: false
        }
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
      },
      rightPriceScale: chartOptions?.rightPriceScale || { visible: true },
      leftPriceScale: chartOptions?.leftPriceScale || { visible: false }
    });
  }

  private createSeries(): ISeriesApi<any> {
    const defaultColors = {
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
      lineColor: '#2962FF'
    };
    const { type, colors = {}, options = {} } = this.chartConfig.series;
    let series: ISeriesApi<any>;
    switch (type) {
      case 'Area':
        series = this.chart.addAreaSeries({
          topColor: colors.topColor || defaultColors.topColor,
          bottomColor: colors.bottomColor || defaultColors.bottomColor,
          lineColor: colors.lineColor || defaultColors.lineColor,
          lineWidth: 2,
          priceScaleId: options.priceScaleId
        });
        break;

      case 'Line':
        series = this.chart.addLineSeries({
          color: colors.lineColor || defaultColors.lineColor,
          lineWidth: 2,
          priceScaleId: options.priceScaleId
        });
        break;

      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }

    const { scaleMargins } = this.chartConfig.chartOptions || {};
    if (scaleMargins) {
      series.priceScale().applyOptions({
        scaleMargins: {
          top: scaleMargins.top || 0.3,
          bottom: scaleMargins.bottom || 0.25
        }
      });
    }

    return series;
  }

  private createTooltip(): void {
    this.toolTip = document.createElement('div');
    this.toolTip.style.cssText = `
        width: ${this.TOOLTIP_WIDTH}px;
        height: auto;
        position: absolute;
        display: none;
        padding: 8px;
        box-sizing: border-box;
        font-size: 12px;
        text-align: left;
        z-index: 1000;
        top: 12px;
        left: 12px;
        pointer-events: none;
        border: 1px solid;
        border-radius: 2px;
        font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: ${this.chartConfig.chartOptions?.backgroundColor || 'white'};
        color: ${this.chartConfig.chartOptions?.textColor || 'black'};
        border-color: #2962FF;
      `;
    this.chartContainer.nativeElement.appendChild(this.toolTip);

    this.setupTooltipSubscription();
  }

  private setupTooltipSubscription(): void {
    this.chart.subscribeCrosshairMove((param) => {
      const container = this.chartContainer.nativeElement;

      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        this.toolTip.style.display = 'none';
        return;
      }

      const data = param.seriesData.get(this.series);
      if (!data) {
        return;
      }

      const formattedValue = this.formatTooltipValue(data);
      if (formattedValue !== null) {
        this.toolTip.style.display = 'block';
        this.toolTip.innerHTML = `
            <div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
              ${formattedValue}
            </div>
            <div style="color: ${'black'}">
              ${param.time}
            </div>`;

        this.positionTooltip(param.point.x, data);
      }
    });
  }

  private formatTooltipValue(data: any): string | null {
    switch (this.chartConfig.series.type) {
      case 'Area':
      case 'Line':
        return data.value !== undefined
          ? `${Math.round(100 * data.value) / 100}`
          : null;

      default:
        return null;
    }
  }

  private positionTooltip(x: number, data: any): void {
    const container = this.chartContainer.nativeElement;
    const price = 'value' in data ? data.value : data.close;
    const coordinate = this.series.priceToCoordinate(price);

    if (coordinate === null) return;

    let shiftedCoordinate = x - 50;
    shiftedCoordinate = Math.max(
      0,
      Math.min(container.clientWidth - this.TOOLTIP_WIDTH, shiftedCoordinate)
    );

    const coordinateY =
      coordinate - this.TOOLTIP_HEIGHT - this.TOOLTIP_MARGIN > 0
        ? coordinate - this.TOOLTIP_HEIGHT - this.TOOLTIP_MARGIN
        : Math.max(
            0,
            Math.min(
              container.clientHeight -
                this.TOOLTIP_HEIGHT -
                this.TOOLTIP_MARGIN,
              coordinate + this.TOOLTIP_MARGIN
            )
          );

    this.toolTip.style.left = `${shiftedCoordinate}px`;
    this.toolTip.style.top = `${coordinateY}px`;
  }

  private setChartData(): void {
    this.series.setData(this.chartConfig.series.data);
  }

  private handleResize = () => {
    this.chart.applyOptions({
      width: this.chartContainer.nativeElement.offsetWidth
    });
    this.chart.timeScale().fitContent();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.chart.remove();
  }

  public resizeChart(): void {
    if (this.chart) {
      this.chart.applyOptions({
        width: this.chartContainer.nativeElement.offsetWidth
      });
      this.chart.timeScale().fitContent();
    }
  }
}
