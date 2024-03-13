<template>
  <div>
    <!-- Filter buttons -->
    <div class="filter-buttons">
      <button
        @click="filterData('1h')"
        :class="{ active: activeFilter === '1h' }"
      >
        1 Hour
      </button>
      <button
        @click="filterData('24h')"
        :class="{ active: activeFilter === '24h' }"
      >
        24 Hours
      </button>
      <button
        @click="filterData('7d')"
        :class="{ active: activeFilter === '7d' }"
      >
        7 Days
      </button>
      <button
        @click="filterData('30d')"
        :class="{ active: activeFilter === '30d' }"
      >
        30 Days
      </button>
    </div>
    <!-- Chart container -->
    <div
      ref="chartContainer"
      style="width: 550px; height: 400px; margin: 0 auto"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chart: null,
      cryptocurrencyData: [
        {
          id: 1,
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'BTC',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          num_market_pairs: '10871',
          cmc_rank: '1',
          price: '72139.2003919586',
          circulating_supply: '19652812',
          total_supply: '19652812',
          last_updated: '2024-03-13T05:27:00.000Z',
          volume_24h: '61029472194.54385',
          volume_change_24h: '-5.6477',
          percent_change_1h: '0.09709489',
          percent_change_24h: '0.24162183',
          percent_change_7d: '9.85127924',
          percent_change_30d: '49.82554745',
          percent_change_60d: '68.11112126',
          percent_change_90d: '68.57509244',
          market_cap: '1417738143133.4888',
        },
        {
          id: 2,
          name: 'Litecoin',
          slug: 'litecoin',
          symbol: 'LTC',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png',
          num_market_pairs: '1128',
          cmc_rank: '20',
          price: '97.11807451855627',
          circulating_supply: '74303656.10750493',
          total_supply: '84000000',
          last_updated: '2024-03-13T05:27:00.000Z',
          volume_24h: '1001777670.2452488',
          volume_change_24h: '-39.6518',
          percent_change_1h: '-0.81650448',
          percent_change_24h: '-2.52376791',
          percent_change_7d: '14.32156288',
          percent_change_30d: '36.61225519',
          percent_change_60d: '34.21285002',
          percent_change_90d: '32.92680544',
          market_cap: '7216228010.849843',
        },

        {
          id: 74,
          name: 'Dogecoin',
          slug: 'dogecoin',
          symbol: 'DOGE',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
          num_market_pairs: '916',
          cmc_rank: '9',
          price: '0.17236832380129655',
          circulating_supply: '143445456383.70523',
          total_supply: '143445456383.70523',
          last_updated: '2024-03-13T05:27:00.000Z',
          volume_24h: '2507210611.1978927',
          volume_change_24h: '-12.849',
          percent_change_1h: '-0.10104219',
          percent_change_24h: '-1.36780033',
          percent_change_7d: '4.73208692',
          percent_change_30d: '114.68073367',
          percent_change_60d: '113.96745866',
          percent_change_90d: '79.65935412',
          market_cap: '24725452873.771263',
        },
        {
          id: 328,
          name: 'Monero',
          slug: 'monero',
          symbol: 'XMR',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/328.png',
          num_market_pairs: '271',
          cmc_rank: '48',
          price: '147.04133660441158',
          circulating_supply: '18409547.68584193',
          total_supply: '18409547.68584193',
          last_updated: '2024-03-13T05:27:00.000Z',
          volume_24h: '71402711.56555751',
          volume_change_24h: '-3.9876',
          percent_change_1h: '0.37832768',
          percent_change_24h: '1.75217952',
          percent_change_7d: '1.09812418',
          percent_change_30d: '21.11078515',
          percent_change_60d: '-3.31221234',
          percent_change_90d: '-12.67148248',
          market_cap: '2706964498.0088496',
        },
        {
          id: 512,
          name: 'Stellar',
          slug: 'stellar',
          symbol: 'XLM',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/512.png',
          num_market_pairs: '578',
          cmc_rank: '34',
          price: '0.15071418154498745',
          circulating_supply: '28652698455.156082',
          total_supply: '50001787021.71013',
          last_updated: '2024-03-13T05:26:00.000Z',
          volume_24h: '221752865.78368232',
          volume_change_24h: '-58.3958',
          percent_change_1h: '0.4616082',
          percent_change_24h: '-0.98171663',
          percent_change_7d: '12.51292321',
          percent_change_30d: '36.6978106',
          percent_change_60d: '26.15757977',
          percent_change_90d: '20.94185519',
          market_cap: '4318367996.724175',
        },
        {
          id: 825,
          name: 'Tether USDt',
          slug: 'tether',
          symbol: 'USDT',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
          num_market_pairs: '77891',
          cmc_rank: '3',
          price: '1.0003373519315544',
          circulating_supply: '102662860009.6692',
          total_supply: '106797122778.23004',
          last_updated: '2024-03-13T05:26:00.000Z',
          volume_24h: '113112980109.77145',
          volume_change_24h: '-2.9311',
          percent_change_1h: '0.00414632',
          percent_change_24h: '0.03973948',
          percent_change_7d: '-0.0141711',
          percent_change_30d: '0.00175793',
          percent_change_60d: '0.04096781',
          percent_change_90d: '0.02105472',
          market_cap: '102697493523.79236',
        },
        {
          id: 1027,
          name: 'Ethereum',
          slug: 'ethereum',
          symbol: 'ETH',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
          num_market_pairs: '8532',
          cmc_rank: '2',
          price: '4040.131342749603',
          circulating_supply: '120089623.3167966',
          total_supply: '120089623.3167966',
          last_updated: '2024-03-13T05:27:00.000Z',
          volume_24h: '26150009590.05244',
          volume_change_24h: '-6.4857',
          percent_change_1h: '0.19100789',
          percent_change_24h: '-0.00433613',
          percent_change_7d: '8.44044702',
          percent_change_30d: '61.70292539',
          percent_change_60d: '58.7903148',
          percent_change_90d: '78.80888564',
          market_cap: '485177851101.1835',
        },
        {
          id: 1321,
          name: 'Ethereum Classic',
          slug: 'ethereum-classic',
          symbol: 'ETC',
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png',
          num_market_pairs: '513',
          cmc_rank: '24',
          price: '37.146507737416876',
          circulating_supply: '146006869.00784722',
          total_supply: '210700000',
          last_updated: '2024-03-13T05:27:00.000Z',
          volume_24h: '393310809.15601945',
          volume_change_24h: '-44.2238',
          percent_change_1h: '0.1331799',
          percent_change_24h: '-0.03028888',
          percent_change_7d: '3.15444465',
          percent_change_30d: '44.18664737',
          percent_change_60d: '26.00612578',
          percent_change_90d: '81.46959783',
          market_cap: '5423645289.316009',
        },
        // Add more items as needed
      ],
      originalData: [],
      activeFilter: '1h',
    };
  },
  mounted() {
    this.loadHighchartsScript().then(() => {
      this.originalData = [...this.cryptocurrencyData];
      this.renderChart();
      this.startAnimation();
    });
  },
  methods: {
    loadHighchartsScript() {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://code.highcharts.com/highcharts.js';
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    },
    renderChart() {
      // Render the bubble chart with default 1-hour filter
      this.filterData(this.activeFilter);
    },
    startAnimation() {
      setInterval(() => {
        this.updateBubbleData();
      }, 1000);
    },

    filterData(interval) {
      this.activeFilter = interval;
      const filteredData = this.originalData.map((item) => {
        let percentageChange;
        switch (interval) {
          case '1h':
            percentageChange = parseFloat(item.percent_change_1h);
            break;
          case '24h':
            percentageChange = parseFloat(item.percent_change_24h);
            break;
          case '7d':
            percentageChange = parseFloat(item.percent_change_7d);
            break;
          case '30d':
            percentageChange = parseFloat(item.percent_change_30d);
            break;
          default:
            break;
        }

        const change = isNaN(percentageChange)
          ? 'N/A'
          : percentageChange.toFixed(2);

        return {
          ...item,
          percent_change: change,
        };
      });

      this.updateChart(filteredData);
    },

    updateChart(data) {
      const processedData = data.map((crypto, index) => {
        let percentageChange;
        switch (this.activeFilter) {
          case '1h':
            percentageChange = parseFloat(crypto.percent_change_1h);
            break;
          case '24h':
            percentageChange = parseFloat(crypto.percent_change_24h);
            break;
          case '7d':
            percentageChange = parseFloat(crypto.percent_change_7d);
            break;
          case '30d':
            percentageChange = parseFloat(crypto.percent_change_30d);
            break;
          default:
            percentageChange = NaN;
            break;
        }
        const change = isNaN(percentageChange)
          ? 'N/A'
          : percentageChange.toFixed(2);
        return {
          x: index,
          y: Math.random() * 100,
          z: Math.abs(percentageChange) * 10,
          name: crypto.symbol,
          image: crypto.image,
          change: change,
          color:
            percentageChange < 0
              ? 'rgba(255, 0, 0, 0.5)'
              : 'rgba(0, 255, 0, 0.5)', // Set color based on percentage change
        };
      });

      if (this.chart) {
        this.chart.series[0].setData(processedData);
      } else {
        this.chart = Highcharts.chart(this.$refs.chartContainer, {
          chart: {
            type: 'bubble',
            zoomType: 'xy',
          },
          xAxis: {
            visible: false,
          },
          yAxis: {
            visible: false,
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                useHTML: true,
                formatter: function () {
                  return `<div style="text-align:center;"><img src="${this.point.image}" style="width:20px; height:20px;"/><br>${this.point.name}<br>${this.point.change}</div>`;
                },
                style: {
                  textOutline: false,
                },
              },
              stickyTracking: false,
              states: {
                hover: {
                  halo: {
                    size: 5,
                  },
                },
              },
            },
            bubble: {
              minSize: '20%',
              maxSize: '25%',
            },
          },

          series: [
            {
              data: processedData,
              marker: {
                symbol: 'circle',
              },
              colorByPoint: false, // Disable color by point
            },
          ],
        });
      }
    },

    updateBubbleData() {
      if (this.chart) {
        const series = this.chart.series[0];
        series.data.forEach((point) => {
          const newX = point.x + (Math.random() - 0.5) * 0.5; // Adjust the range of movement as needed
          const newY = point.y + (Math.random() - 0.5) * 0.5; // Adjust the range of movement as needed
          point.update({ x: newX, y: newY }, false);
        });
        this.chart.redraw();
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
.filter-buttons {
  margin-bottom: 20px;
}

.filter-buttons button {
  margin-right: 10px;
  cursor: pointer;
}

.filter-buttons button.active {
  font-weight: bold;
}
</style>
