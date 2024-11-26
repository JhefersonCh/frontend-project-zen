import { AreaData, CustomData, LineData } from 'lightweight-charts';

export type ChartTypes = 'Area' | 'Line' | 'StackedArea';

export interface StackedAreaData extends CustomData {
  // eslint-disable-next-line @typescript-eslint/array-type
  values: Array<{ time: number; value: number }>; // Asegúrate de que los datos estén en un formato consistente
}

export interface SeriesConfiguration {
  type: ChartTypes;
  data: AreaData[] | LineData[] | StackedAreaData[];
  name?: string;
  colors?: {
    topColor?: string;
    bottomColor?: string;
    lineColor?: string;
  };
  options?: {
    priceScaleId?: string;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
  };
}

interface BaseChartConfigurationInterface {
  chartOptions?: {
    height?: number;
    backgroundColor?: string;
    textColor?: string;
    width?: string;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
    rightPriceScale?: {
      visible?: boolean;
    };
    leftPriceScale?: {
      visible?: boolean;
    };
    overlayPriceScales?: {
      visible?: boolean;
    };
    crosshair?: {
      visible?: boolean;
      mode?: 'normal' | 'cross';
    };
    zoom?: {
      enabled?: boolean;
    };
  };
}

export interface AreaOrLineChartConfigInterface
  extends BaseChartConfigurationInterface {
  series: SeriesConfiguration;
}

export interface StackedAreaChartConfigInterface
  extends BaseChartConfigurationInterface {
  series: SeriesConfiguration[];
}
