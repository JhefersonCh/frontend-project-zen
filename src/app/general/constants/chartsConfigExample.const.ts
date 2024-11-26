import {
  AreaOrLineChartConfigInterface,
  StackedAreaChartConfigInterface
} from '../../shared/interfaces/charts.interface';

export const areaOrLineChartConfig: AreaOrLineChartConfigInterface = {
  series: {
    type: 'Area',
    data: [
      { time: '2019-02-25', value: 25.93 },
      { time: '2019-02-26', value: 25.92 },
      { time: '2019-02-27', value: 25.67 },
      { time: '2019-02-28', value: 25.79 },
      { time: '2019-03-01', value: 25.86 },
      { time: '2019-03-04', value: 25.94 },
      { time: '2019-03-05', value: 26.02 },
      { time: '2019-03-06', value: 25.95 },
      { time: '2019-03-07', value: 25.89 },
      { time: '2019-03-08', value: 25.94 },
      { time: '2019-03-11', value: 25.91 },
      { time: '2019-03-12', value: 25.92 },
      { time: '2019-03-13', value: 26.0 },
      { time: '2019-03-14', value: 26.05 },
      { time: '2019-03-15', value: 26.11 },
      { time: '2019-03-18', value: 26.1 },
      { time: '2019-03-19', value: 25.98 },
      { time: '2019-03-20', value: 26.11 },
      { time: '2019-03-21', value: 26.12 },
      { time: '2019-03-22', value: 25.88 },
      { time: '2019-03-25', value: 25.85 },
      { time: '2019-03-26', value: 25.72 },
      { time: '2019-03-27', value: 25.73 },
      { time: '2019-03-28', value: 25.8 },
      { time: '2019-03-29', value: 25.77 },
      { time: '2019-04-01', value: 26.06 },
      { time: '2019-04-02', value: 25.93 },
      { time: '2019-04-03', value: 25.95 },
      { time: '2019-04-04', value: 26.06 },
      { time: '2019-04-05', value: 26.16 },
      { time: '2019-04-08', value: 26.12 },
      { time: '2019-04-09', value: 26.07 },
      { time: '2019-04-10', value: 26.13 },
      { time: '2019-04-11', value: 26.04 },
      { time: '2019-04-12', value: 26.04 },
      { time: '2019-04-15', value: 26.05 },
      { time: '2019-04-16', value: 26.01 },
      { time: '2019-04-17', value: 26.09 },
      { time: '2019-04-18', value: 26.0 },
      { time: '2019-04-22', value: 26.0 },
      { time: '2019-04-23', value: 26.06 },
      { time: '2019-04-24', value: 26.0 },
      { time: '2019-04-25', value: 25.81 },
      { time: '2019-04-26', value: 25.88 },
      { time: '2019-04-29', value: 25.91 },
      { time: '2019-04-30', value: 25.9 },
      { time: '2019-05-01', value: 26.02 },
      { time: '2019-05-02', value: 25.97 },
      { time: '2019-05-03', value: 26.02 },
      { time: '2019-05-06', value: 26.03 },
      { time: '2019-05-07', value: 26.04 },
      { time: '2019-05-08', value: 26.05 },
      { time: '2019-05-09', value: 26.05 },
      { time: '2019-05-10', value: 26.08 },
      { time: '2019-05-13', value: 26.05 },
      { time: '2019-05-14', value: 26.01 },
      { time: '2019-05-15', value: 26.03 },
      { time: '2019-05-16', value: 26.14 },
      { time: '2019-05-17', value: 26.09 },
      { time: '2019-05-20', value: 26.01 },
      { time: '2019-05-21', value: 26.12 },
      { time: '2019-05-22', value: 26.15 },
      { time: '2019-05-23', value: 26.18 },
      { time: '2019-05-24', value: 26.16 },
      { time: '2019-05-28', value: 26.23 }
    ],
    colors: {
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
      lineColor: '#2962FF'
    },
    options: {
      scaleMargins: {
        top: 0.3,
        bottom: 0.25
      }
    }
  }
};

export const stackedAreaConfig: StackedAreaChartConfigInterface = {
  series: [
    {
      type: 'StackedArea',
      name: 'Area 1',
      data: [
        { time: '2019-04-11', value: 30 },
        { time: '2019-04-12', value: 40 },
        { time: '2019-04-13', value: 35 },
        { time: '2019-04-14', value: 45 },
        { time: '2019-04-15', value: 60 },
        { time: '2019-04-16', value: 55 },
        { time: '2019-04-17', value: 50 },
        { time: '2019-04-18', value: 55 },
        { time: '2019-04-19', value: 60 },
        { time: '2019-04-20', value: 70 },
        { time: '2019-04-21', value: 65 },
        { time: '2019-04-22', value: 80 }
      ],
      colors: {
        topColor: '#2962FF',
        bottomColor: 'transparent',
        lineColor: '#2962FF'
      }
    },
    {
      type: 'StackedArea',
      name: 'Area 2',
      data: [
        { time: '2019-04-11', value: 20 },
        { time: '2019-04-12', value: 30 },
        { time: '2019-04-13', value: 50 },
        { time: '2019-04-14', value: 40 },
        { time: '2019-04-15', value: 50 },
        { time: '2019-04-16', value: 45 },
        { time: '2019-04-17', value: 40 },
        { time: '2019-04-18', value: 60 },
        { time: '2019-04-19', value: 55 },
        { time: '2019-04-20', value: 50 },
        { time: '2019-04-21', value: 40 },
        { time: '2019-04-22', value: 60 }
      ],
      colors: {
        topColor: '#26a69a',
        bottomColor: 'transparent',
        lineColor: '#26a69a'
      }
    },
    {
      type: 'StackedArea',
      name: 'Area 3',
      data: [
        { time: '2019-04-11', value: 24 },
        { time: '2019-04-12', value: 68 },
        { time: '2019-04-13', value: 80 },
        { time: '2019-04-14', value: 75 },
        { time: '2019-04-15', value: 65 },
        { time: '2019-04-16', value: 100 },
        { time: '2019-04-17', value: 110 },
        { time: '2019-04-18', value: 130 },
        { time: '2019-04-19', value: 140 },
        { time: '2019-04-20', value: 120 },
        { time: '2019-04-21', value: 110 },
        { time: '2019-04-22', value: 100 }
      ],
      colors: {
        topColor: '#FFEB3B',
        bottomColor: 'transparent',
        lineColor: '#FFEB3B'
      }
    },
    {
      type: 'StackedArea',
      name: 'Area 4',
      data: [
        { time: '2019-04-11', value: 10 },
        { time: '2019-04-12', value: 20 },
        { time: '2019-04-13', value: 40 },
        { time: '2019-04-14', value: 35 },
        { time: '2019-04-15', value: 45 },
        { time: '2019-04-16', value: 50 },
        { time: '2019-04-17', value: 60 },
        { time: '2019-04-18', value: 55 },
        { time: '2019-04-19', value: 70 },
        { time: '2019-04-20', value: 65 },
        { time: '2019-04-21', value: 80 },
        { time: '2019-04-22', value: 90 }
      ],
      colors: {
        topColor: '#FF5722',
        bottomColor: 'transparent',
        lineColor: '#FF5722'
      }
    },
    {
      type: 'StackedArea',
      name: 'Area 5',
      data: [
        { time: '2019-04-11', value: 5 },
        { time: '2019-04-12', value: 15 },
        { time: '2019-04-13', value: 25 },
        { time: '2019-04-14', value: 20 },
        { time: '2019-04-15', value: 30 },
        { time: '2019-04-16', value: 45 },
        { time: '2019-04-17', value: 50 },
        { time: '2019-04-18', value: 60 },
        { time: '2019-04-19', value: 80 },
        { time: '2019-04-20', value: 75 },
        { time: '2019-04-21', value: 90 },
        { time: '2019-04-22', value: 100 }
      ],
      colors: {
        topColor: '#8BC34A',
        bottomColor: 'transparent',
        lineColor: '#8BC34A'
      }
    }
  ],
  chartOptions: {
    height: 300,
    width: '100%'
  }
};
