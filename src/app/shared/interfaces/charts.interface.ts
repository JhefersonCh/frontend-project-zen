import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexYAxis
} from 'ng-apexcharts';
/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  stroke?: ApexStroke;
  fill?: ApexFill;
  labels?: string[];
  responsive?: {
    breakpoint: number;
    options: {
      chart: {
        width: number;
      };
      legend: {
        position: 'bottom' | 'top' | 'left' | 'right';
        show: boolean;
      };
    };
  }[];
  tooltip: ApexTooltip;
};

export interface BarChartOptions {
  series: {
    name: string;
    data: number[];
  }[];
  chart: {
    type: 'bar';
    height?: number;
    width?: string | number;
    stacked?: boolean;
    toolbar?: {
      show?: boolean;
    };
  };
  plotOptions?: {
    bar: {
      horizontal?: boolean;
      columnWidth?: string;
      borderRadius?: number;
      distributed?: boolean;
    };
  };
  dataLabels?: {
    enabled?: boolean;
  };
  xaxis: {
    categories: string[];
  };
  yaxis?: {
    title?: {
      text?: string;
    };
  };
  fill?: {
    opacity?: number;
    colors?: string[];
  };
  legend?: {
    position?: 'top' | 'bottom' | 'right' | 'left';
    show?: boolean;
  };
  colors?: string[];
  title: ApexTitleSubtitle;
  grid?: ApexGrid;
}

export interface PolarChartOptions {
  series: number[];
  chart: {
    type: 'polarArea';
    width?: string | number;
    height?: number;
  };
  labels: string[];
  stroke: {
    colors: string[];
  };
  fill: {
    opacity: number;
  };
  legend: {
    position: 'bottom';
    show: boolean;
  };
  dataLabels: ApexDataLabels;
  responsive: {
    breakpoint: number;
    options: {
      chart?: {
        width?: string | number;
      };
      legend: {
        position: string;
      };
    };
  }[];
  title: ApexTitleSubtitle;
}
