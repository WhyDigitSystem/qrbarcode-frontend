// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

const chartData = {
  height: 380,
  type: 'bar',
  options: {
    chart: {
      id: 'bar-chart',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Casio', 'Mars', 'Amazon', 'Ekart', 'Flipcart', 'ABT', 'Britania', 'parle', 'Pedigree', 'Jockey']
    },
    legend: {
      show: true,
      fontSize: '14px',
      fontFamily: `'Roboto', sans-serif`,
      position: 'bottom',
      offsetX: 20,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    }
  },
  series: [
    {
      name: 'In',
      data: [35, 125, 35, 35, 35, 80, 45, 30, 65, 33]
    },
    {
      name: 'Low',
      data: [35, 15, 15, 35, 65, 40, 55, 20, 35, 46]
    },
    {
      name: 'Out',
      data: [35, 145, 35, 35, 20, 105, 35, 80, 34, 55]
    }
  ]
};
export default chartData;
