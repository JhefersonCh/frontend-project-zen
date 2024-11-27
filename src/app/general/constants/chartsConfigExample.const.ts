import {
  BarChartOptions,
  ChartOptions
} from '../../shared/interfaces/charts.interface';

export const barExampre: Partial<BarChartOptions> = {
  series: [
    {
      name: 'Proyectos',
      data: [44, 55, 57, 56, 61, 58, 23, 45, 43, 89, 29, 55]
    }
  ],
  xaxis: {
    categories: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
  },
  colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'],
  title: {
    text: 'ola q ase',
    align: 'center',
    margin: 50,
    style: {
      fontSize: '26px'
    }
  }
};

export const polarExample: Partial<ChartOptions> = {
  series: [42, 47, 52, 58, 65],
  labels: ['Serie A', 'Serie B', 'Serie C', 'Serie D', 'Serie E'],
  title: {
    text: 'ola q ase 2',
    align: 'center',
    margin: 50,
    style: {
      fontSize: '26px'
    }
  }
};
