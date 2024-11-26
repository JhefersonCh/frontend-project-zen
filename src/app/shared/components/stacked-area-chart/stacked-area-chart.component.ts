/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  SeriesConfiguration,
  StackedAreaChartConfigInterface
} from '../../interfaces/charts.interface';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

@Component({
  selector: 'app-stacked-area-chart',
  standalone: true,
  imports: [],
  templateUrl: './stacked-area-chart.component.html',
  styleUrl: './stacked-area-chart.component.scss'
})
export class StackedAreaChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() configuration!: StackedAreaChartConfigInterface;

  private chart!: IChartApi;
  private seriesMap: Map<string, ISeriesApi<any>> = new Map();
  private toolTip!: HTMLDivElement;
  private readonly TOOLTIP_WIDTH = 150;
  private readonly TOOLTIP_HEIGHT = 80;
  private readonly TOOLTIP_MARGIN = 15;

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeChart();
      this.createAllSeries();
      this.createTooltip();
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
    const { chartOptions } = this.configuration;

    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.offsetWidth,
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

  private createAllSeries(): void {
    this.configuration.series.forEach((seriesConfig, index) => {
      const series = this.createSingleSeries(seriesConfig, index);
      if (series) {
        const seriesId = seriesConfig.name || `series-${index}`;
        this.seriesMap.set(seriesId, series);
        series.setData(seriesConfig.data);
      }
    });
  }

  private createSingleSeries(
    config: SeriesConfiguration,
    index: number
  ): ISeriesApi<any> {
    const defaultColors = this.getDefaultColors(index);
    const { colors = {}, options = {} } = config;

    const series: ISeriesApi<any> = this.chart.addAreaSeries({
      topColor: colors.topColor || defaultColors.topColor,
      bottomColor: colors.bottomColor || defaultColors.bottomColor,
      lineColor: colors.lineColor || defaultColors.lineColor,
      lineWidth: 2,
      priceScaleId: options.priceScaleId
    });

    const { scaleMargins } = this.configuration.chartOptions || {};
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

  private getDefaultColors(index: number) {
    const colors = [
      {
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
        lineColor: '#2962FF'
      },
      {
        topColor: '#26a69a',
        bottomColor: 'rgba(38, 166, 154, 0.28)',
        lineColor: '#26a69a'
      },
      {
        topColor: '#ff6b6b',
        bottomColor: 'rgba(255, 107, 107, 0.28)',
        lineColor: '#ff6b6b'
      },
      {
        topColor: '#ffd93d',
        bottomColor: 'rgba(255, 217, 61, 0.28)',
        lineColor: '#ffd93d'
      },
      {
        topColor: '#6c5ce7',
        bottomColor: 'rgba(108, 92, 231, 0.28)',
        lineColor: '#6c5ce7'
      }
    ];
    return colors[index % colors.length];
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
      background: ${this.configuration.chartOptions?.backgroundColor || 'white'};
      color: ${this.configuration.chartOptions?.textColor || 'black'};
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

      let tooltipHtml = `<div style="color: ${this.configuration.chartOptions?.textColor || 'black'}">
        ${param.time}
      </div>`;

      // Collect data from all series
      this.configuration.series.forEach((seriesConfig, index) => {
        const series = this.seriesMap.get(
          seriesConfig.name || `series-${index}`
        );
        if (series) {
          const data = param.seriesData.get(series);
          if (data) {
            const value = this.formatTooltipValue(data);
            const color =
              series.options()['lineColor'] ||
              this.getDefaultColors(index).lineColor;
            tooltipHtml += `
              <div style="color: ${color}; margin-top: 4px;">
                ${seriesConfig.name || `Series ${index + 1}`}: ${value}
              </div>`;
          }
        }
      });

      this.toolTip.style.display = 'block';
      this.toolTip.innerHTML = tooltipHtml;

      // Position tooltip
      let shiftedCoordinate = param.point.x - 50;
      shiftedCoordinate = Math.max(
        0,
        Math.min(container.clientWidth - this.TOOLTIP_WIDTH, shiftedCoordinate)
      );

      const coordinateY = Math.max(
        0,
        Math.min(
          container.clientHeight - this.TOOLTIP_HEIGHT - this.TOOLTIP_MARGIN,
          param.point.y
        )
      );

      this.toolTip.style.left = `${shiftedCoordinate}px`;
      this.toolTip.style.top = `${coordinateY}px`;
    });
  }

  private formatTooltipValue(data: any): string {
    return data.value !== undefined
      ? `${Math.round(100 * data.value) / 100}`
      : 'N/A';
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
