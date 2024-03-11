<script>
import Highcharts from 'highcharts';
import HighchartsVue from 'vue-highcharts';

// Include packed-bubble.js directly
require('highcharts/highcharts-more.js')(Highcharts);

// Set your Highcharts license key
Highcharts.setOptions({
  licenseKey: '6E5D-5973-0560-97B0-E295',
});

export default {
  components: {
    highcharts: HighchartsVue,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'packedbubble',
          height: '100%',
        },
        title: {
          text: 'Carbon emissions around the world (2014)',
          align: 'left',
        },
        // tooltip: {
        //   useHTML: true,
        //   pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>',
        // },
        plotOptions: {
          packedbubble: {
            minSize: '30%',
            maxSize: '120%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
              splitSeries: false,
              gravitationalConstant: 0.02,
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              filter: {
                property: 'y',
                operator: '>',
                value: 250,
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal',
              },
            },
          },
        },
        series: [
          {
            name: 'Europe',
            data: [
              { name: 'Germany', value: 767.1 },
              { name: 'Croatia', value: 20.7 },
              // Add more data for other regions...
            ],
          },
        ],
      },
    };
  },
};
</script>
