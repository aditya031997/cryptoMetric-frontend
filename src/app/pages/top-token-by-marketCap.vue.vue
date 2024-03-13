<!-- <template>
  <div>
    <div v-if="dataReceived">
      <div
        v-for="(item, index) in data"
        :key="index"
      >
        <p>{{ item }}</p>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      data: [],
      dataReceived: false,
    };
  },
  mounted() {
    this.socket = io('http://localhost:5000');
    this.saveSocketId();
    this.socket.on('InitialTableListing', (initialData) => {
      console.log('Received InitialTableListing event:', initialData);
      this.data = initialData.data;
      this.dataReceived = true;
    });

    this.socket.on('UpdatedTableListing', (updatedData) => {
      console.log('Received UpdatedTableListing event:', updatedData);
      this.data = updatedData;
      this.saveSocketId();
    });
  },
  methods: {
    saveSocketId() {
      this.socket.emit('saveSocketId', '2');
    },
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script> -->
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
import io from 'socket.io-client';
export default {
  data() {
    return {
      chart: null,
      cryptocurrencyData: [],
      originalData: [],
      activeFilter: '1h',
      socket: null,
      dataReceived: false,
    };
  },
  mounted() {
    this.socket = io('http://localhost:5000');
    this.saveSocketId();
    this.socket.on('InitialTableListing', (initialData) => {
      console.log('Received InitialTableListing event:', initialData.data);
      this.cryptocurrencyData = initialData.data;
      this.originalData = [...this.cryptocurrencyData];
      this.renderChart();
      this.startAnimation();
      this.dataReceived = true;
    });

    this.socket.on('UpdatedTableListing', (updatedData) => {
      console.log('Received UpdatedTableListing event:', updatedData.data);
      this.cryptocurrencyData = updatedData.data;
      this.originalData = [...this.cryptocurrencyData];
      this.renderChart();
      this.startAnimation();
      this.dataReceived = true;
      this.saveSocketId();
    });
  },
  methods: {
    saveSocketId() {
      this.socket.emit('saveSocketId', '2');
    },
    renderChart() {
      // Render the bubble chart with default 1-hour filter
      this.filterData(this.activeFilter);
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

        const change = isNaN(percentageChange) ? 'N/A' : percentageChange.toFixed(2);

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
        const change = isNaN(percentageChange) ? 'N/A' : percentageChange.toFixed(2);
        return {
          x: index,
          y: Math.random() * 100,
          z: Math.abs(percentageChange) * 10,
          name: crypto.symbol,
          image: crypto.image,
          change: change,
          color: percentageChange < 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)',
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
              colorByPoint: false,
            },
          ],
        });
      }
    },
    updateBubbleData() {
      if (this.chart) {
        const series = this.chart.series[0];
        series.data.forEach((point) => {
          const newX = point.x + (Math.random() - 0.5) * 0.5;
          const newY = point.y + (Math.random() - 0.5) * 0.5;
          point.update({ x: newX, y: newY }, false);
        });
        this.chart.redraw();
      }
    },
    startAnimation() {
      setInterval(() => {
        this.updateBubbleData();
      }, 1000);
    },
  },
};
</script>

<style scoped>
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
