<template>
  <div>
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
    <div>
      <div
        ref="chartContainer"
        style="width: 1050px; height: 500px; margin: 0 auto"
      ></div>
      <div class="pagination">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import configs from '../../configs/configs';
export default {
  data() {
    return {
      chart: null,
      cryptocurrencyData: [],
      originalData: [],
      activeFilter: '1h',
      socket: null,
      dataReceived: false,
      currentPage: 1,
      totalPages: 1,
      bubblesPerPage: 20,
    };
  },
  mounted() {
    this.socket = io(configs.LOCAL_API_URL);
    this.socket.on('InitialTableListing', (initialData) => {
      this.cryptocurrencyData = initialData.data;
      this.originalData = [...this.cryptocurrencyData];
      this.updatePagination();
      this.renderChart();
      this.startAnimation();
      this.dataReceived = true;
    });

    this.socket.on('UpdatedTableListing', (updatedData) => {
      this.cryptocurrencyData = updatedData.data;
      this.originalData = [...this.cryptocurrencyData];
      this.updatePagination();
      this.renderChart();
      this.startAnimation();
      this.dataReceived = true;
    });
  },
  methods: {
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
      const startIdx = (this.currentPage - 1) * this.bubblesPerPage;
      const endIdx = startIdx + this.bubblesPerPage;
      const processedData = data.slice(startIdx, endIdx).map((crypto, index) => {
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

        const link = `https://www.coingecko.com/en/coins/${crypto.slug}`;

        // Adjust color based on percentage change
        let color;
        if (percentageChange >= 0) {
          // Green shades for positive change
          const greenShade = 255 - Math.floor(percentageChange * 2.55);
          color = `rgba(0, ${greenShade}, 0, 0.5)`;
        } else {
          // Red shades for negative change
          const redShade = 255 + Math.floor(percentageChange * 2.55);
          color = `rgba(${redShade}, 0, 0, 0.5)`;
        }

        return {
          x: index,
          y: Math.random() * 100,
          z: Math.abs(percentageChange) * 10,
          name: crypto.symbol,
          image: crypto.image,
          change: change,
          color: color,
          slug: crypto.slug, // Include slug property
          link: link, // Include link property
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
          title: {
            text: null, // This disables the title
          },
          legend: {
            enabled: false, // Disables the legend
          },
          tooltip: {
            enabled: false, // Disables the tooltip
          },
          xAxis: {
            visible: false,
          },
          yAxis: {
            visible: false,
          },
          plotOptions: {
            series: {
              point: {
                events: {
                  click: function () {
                    window.open(this.options.link, '_blank');
                  },
                },
              },
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
        const bubbleRadius = series.data[0].marker.radius; // Get the radius of the bubbles

        // Iterate through each bubble
        series.data.forEach((point) => {
          let newX = point.x;
          let newY = point.y;

          // Adjust the position of the current bubble based on its neighbors
          series.data.forEach((otherPoint) => {
            if (otherPoint !== point) {
              const distance = Math.sqrt(Math.pow(newX - otherPoint.x, 2) + Math.pow(newY - otherPoint.y, 2));
              const minDistance = bubbleRadius * 2; // Minimum distance between bubbles to avoid overlap

              // If the current bubble is too close to another bubble, adjust its position
              if (distance < minDistance) {
                const directionX = Math.sign(newX - otherPoint.x);
                const directionY = Math.sign(newY - otherPoint.y);
                const overlap = minDistance - distance;
                newX += (overlap / 2) * directionX;
                newY += (overlap / 2) * directionY;
              }
            }
          });

          // Update bubble position
          point.update({ x: newX, y: newY }, false);
        });

        // Redraw the chart after adjusting all bubble positions
        this.chart.redraw();
      }
    },
    updatePagination() {
      // Calculate total pages based on the length of data
      this.totalPages = Math.ceil(this.originalData.length / this.bubblesPerPage);
      // Ensure current page is within bounds
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.filterData(this.activeFilter);
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.filterData(this.activeFilter);
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

.pagination {
  margin-top: 10px;
}

.pagination button {
  margin-right: 5px;
}
</style>
