<template>
  <div>
    <!-- Filter buttons -->
    <div class="filter-buttons">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="filterData(filter.value)"
        :class="{ active: activeFilter === filter.value }"
      >
        {{ filter.label }}
      </button>
    </div>
    <!-- Chart container -->
    <div>
      <div
        ref="chartContainer"
        style="width: 1050px; height: 500px; margin: 0 auto"
      ></div>
      <!-- Custom Pagination -->
      <div class="pagination">
        <button @click="gotoFirstPage">&lt;&lt;</button>
        <button @click="previousPage">&lt;</button>
        <span
          v-for="pageNumber in paginationNumbers"
          :key="pageNumber"
        >
          <button
            @click="gotoPage(pageNumber)"
            :class="{ active: currentPage === pageNumber }"
          >
            {{ pageNumber }}
          </button>
        </span>
        <button @click="nextPage">&gt;</button>
        <button @click="gotoLastPage">&gt;&gt;</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import configs from '../../configs/configs';
import { mapGetters } from 'vuex';
import {
  getImageCoin,
  getBigImageCoin,
} from '.././utils/helpers/formatter-images';

export default {
  data() {
    return {
      chart: null,
      cryptocurrencyData: [],
      originalData: [],
      activeFilter: '1h',
      currentPage: 1,
      totalPages: 1,
      bubblesPerPage: 55,
      filters: [
        { label: '1 Hour', value: '1h' },
        { label: '24 Hours', value: '24h' },
        { label: '7 Days', value: '7d' },
        { label: '30 Days', value: '30d' },
        { label: 'Favorites', value: 'favorites' },
      ],
    };
  },
  mounted() {
    this.socket = io(configs.LOCAL_API_URL);
    this.socket.on('InitialTableListing', (initialData) => {
      console.log(initialData, 'initialData');
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
    loadHighchartsScript() {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://code.highcharts.com/highcharts.js';
        script.async = true;
        script.onload = () => {
          Highcharts.setOptions({
            licenseKey: '6E5D-5973-0560-97B0-E295',
          });
          resolve();
        };
        document.head.appendChild(script);
      });
    },
    renderChart() {
      this.filterData(this.activeFilter);
    },
    startAnimation() {
      const animationInterval = 1000; // Adjust animation interval as needed
      setInterval(() => {
        console.log('Updating bubble data...');
        this.updateBubbleData();
      }, animationInterval);
    },
    filterFavorites(data) {
      const favorites = this.getFavorites.map((favorite) => favorite.slug);
      return data.filter((item) => favorites.includes(item.slug));
    },

    filterData(interval) {
      this.activeFilter = interval;
      const imageUrl = this.getCoinImageUrl();
      if (interval === 'favorites') {
        const favoriteData = this.filterFavorites(this.getFavorites);

        this.updateChart(favoriteData, imageUrl);
      } else {
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
            // imageUrl: imageUrl,
          };
        });
        this.updateChart(filteredData, imageUrl);
      }
    },

    updateChart(data, imageUrl) {
      const startIdx = (this.currentPage - 1) * this.bubblesPerPage;
      const endIdx = Math.min(startIdx + this.bubblesPerPage, data.length);

      const numDataPoints = endIdx - startIdx;

      const containerWidth = 1050;
      const containerHeight = 500;

      const maxBubbleSize = Math.min(containerWidth, containerHeight) * 0.99;
      const minBubbleSize = maxBubbleSize * 2;

      const bubbleSpacingX = containerWidth / Math.sqrt(numDataPoints);
      const bubbleSpacingY = containerHeight / Math.sqrt(numDataPoints);

      const processedData = data
        .slice(startIdx, endIdx)
        .map((crypto, index) => {
          const row = Math.floor(index / Math.sqrt(numDataPoints));
          const col = index % Math.sqrt(numDataPoints);
          const x = col * bubbleSpacingX + bubbleSpacingX / 1;
          const y = row * bubbleSpacingY + bubbleSpacingY / 1;
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
            case 'favorites':
              percentageChange = parseFloat(crypto.percent_change_24h);
              break;
            default:
              percentageChange = NaN;
              break;
          }

          let dynamicBubbleSize = minBubbleSize;

          const link = `https://www.coingecko.com/en/coins/${crypto.slug}`;

          let color;
          if (percentageChange >= 0) {
            dynamicBubbleSize +=
              (percentageChange / 100) * (maxBubbleSize - minBubbleSize) * 1.5;
            color = {
              radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: [
                [0, 'rgba(33,128,81,0.15)'],
                [0.8, 'rgba(33,128,81,0.15)'],
                [1, 'rgba(33,128,81,0.6)'],
              ],
            };
          } else {
            dynamicBubbleSize +=
              (-percentageChange / 100) * (maxBubbleSize - minBubbleSize);
            color = {
              radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: [
                [0, 'rgba(141,38,56,0.2)'],
                [0.8, 'rgba(141,38,56,0.2)'],
                [1, 'rgba(141,38,56,0.65)'],
              ],
            };
          }
          const bubble = {
            x: x,
            y: y,
            z: dynamicBubbleSize,
            name: crypto.symbol,
            image: imageUrl[crypto.slug],
            change: percentageChange.toFixed(2) + '%',
            color: color,
            slug: crypto.slug,
            link: link,
          };

          return bubble;
        });

      if (this.chart) {
        this.chart.series[0].setData(processedData);
      } else {
        this.chart = Highcharts.chart(this.$refs.chartContainer, {
          chart: {
            type: 'bubble',
            backgroundColor: '#9ea8b0',
            events: {
              load: function () {
                const spans = document.querySelectorAll(
                  '.highcharts-label span'
                );
                spans.forEach((span) => {
                  span.style.marginTop = '-10px';
                });
              },
            },
          },
          title: {
            text: null,
          },
          legend: {
            enabled: false,
          },
          tooltip: {
            enabled: false,
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
                allowOverlap: false,
                allign: 'center',
                formatter: function () {
                  return `<div class="bubble-wrapper" style="text-align:center;"><img src="${this.point.image}" style="margin-bottom:px; width:auto; max-width:20px; height:auto; max-height:20px;"/><div class="name" style="font-size:12px; margin-bottom:3px;">${this.point.name}</div><div class="change" style="font-size:10px;">${this.point.change}</div></div>`;
                },
                style: {
                  textOutline: false,
                  border: 'none',
                },
              },
              jitter: {
                x: 0,
                y: 0,
              },

              Animation: true,
              animationLimit: 250,
              boostThreshold: 5000,
              stickyTracking: false,
              // stacking:"stream",
              softThreshold: true,
              type: 'coulmn',
              states: {
                hover: {
                  halo: {
                    size: 10,
                  },
                },
              },
            },
          },

          series: [
            {
              data: processedData,
            },
          ],
        });
      }
    },

    updateBubbleData() {
      if (this.chart) {
        const series = this.chart.series[0];
        const bubbleRadius = series.data[0].marker.radius;
        const containerWidth = this.$refs.chartContainer?.offsetWidth;
        const containerHeight = this.$refs.chartContainer?.offsetHeight;

        // Calculate repulsive forces between bubbles
        const forces = series.data.map((point, index) => {
          let forceX = 0;
          let forceY = 0;

          series.data.forEach((otherPoint, otherIndex) => {
            if (index !== otherIndex) {
              const distanceX = point.x - otherPoint.x;
              const distanceY = point.y - otherPoint.y;
              const distance = Math.sqrt(
                distanceX * distanceX + distanceY * distanceY
              );
              ``;
              const minDistance = bubbleRadius * 0.5;

              if (distance < minDistance) {
                // Calculate repulsive force
                const force = (minDistance - distance) / distance;
                forceX += force * distanceX;
                forceY += force * distanceY;
              }
            }
          });

          return { forceX, forceY };
        });

        // Apply forces to update bubble positions
        series.data.forEach((point, index) => {
          const { forceX, forceY } = forces[index];
          let newX = point.x + forceX;
          let newY = point.y + forceY;

          // Ensure the bubble stays within the bounds of the container
          newX = Math.max(
            bubbleRadius,
            Math.min(containerWidth - bubbleRadius, newX)
          );
          newY = Math.max(
            bubbleRadius,
            Math.min(containerHeight - bubbleRadius, newY)
          );

          point.update({ x: newX, y: newY }, false);
        });

        // Redraw the chart after adjusting all bubble positions
        this.chart.redraw();
      }
    },

    updatePagination() {
      // Calculate total pages based on the length of data and bubblesPerPage
      this.totalPages = Math.ceil(
        this.originalData.length / this.bubblesPerPage
      );
      // Ensure current page is within bounds
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    gotoPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
        this.filterData(this.activeFilter);
      }
    },
    gotoFirstPage() {
      this.gotoPage(1);
    },
    gotoLastPage() {
      this.gotoPage(this.totalPages);
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
    getCoinImageUrl() {
      if (this.activeFilter === 'favorites') {
        const favorites = this.getFavorites.map((favorite) => favorite.slug);
        const imageUrls = {};
        favorites.forEach((slug) => {
          imageUrls[slug] = getBigImageCoin(slug);
        });
        return imageUrls;
      } else {
        const imageUrls = {};
        this.cryptocurrencyData.forEach((crypto) => {
          imageUrls[crypto.slug] = crypto.image;
        });
        return imageUrls;
      }
    },
  },
  computed: {
    paginationNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
    ...mapGetters(['getFavorites']),
  },
  watch: {
    activeFilter: {
      handler(newValue, oldValue) {
        if (typeof this.getCoinImageUrl === 'function') {
          this.getCoinImageUrl();
        }
      },
      immediate: true, // Ensure it's called immediately on component mount
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */

#highcharts-xx9ychm-387 {
  border: none;
}
.highcharts-data-labels {
  border: none;
}
.bubble-wrapper {
}
.bubble-wrapper img {
}
.bubble-wrapper .name {
}
.bubble-wrapper .change {
  font-size: 10px;
}

.highcharts-data-labels span {
}
.filter-buttons {
  display: table;
  justify-content: center;
  align-content: center;
  margin: 20px auto;
  border: 1px solid rgba(1, 183, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.filter-buttons button {
  background-color: rgba(1, 183, 255, 0.1);
  font-size: 12px;
  color: #444;
  padding: 5px 12px;
  border: none;
  cursor: pointer;
}
.filter-buttons button:not(:last-child) {
  border-right: 1px solid rgba(1, 183, 255, 0.2);
}

.pagination button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.filter-buttons button.active {
  background-color: rgba(1, 183, 255, 0.2);
  color: #222;
  font-weight: bold;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
}
.pagination > * {
  background: transparent;
  font-size: 14px;
  padding: 0rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: 8px;
  border: 2px solid transparent;
  min-width: 2rem;
  height: 2rem;
  border-radius: 4px;
  cursor: default;
  transition: all 0.3s ease-in-out 0s;
}
.pagination > *:hover {
  border-color: #bbb;
}

.pagination button {
  cursor: pointer;
}
.pagination span {
}
.pagination button:disabled {
  pointer-events: none;
}
</style>