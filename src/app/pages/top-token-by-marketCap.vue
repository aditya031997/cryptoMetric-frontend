<template>
  <div class="highchart-wrapper">
    <div v-if="isLoading">
      <cm-loader />
    </div>
    <!-- Filter buttons -->
    <div v-else>
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
    </div>

    <!-- Chart container -->
    <div>
      <div
        ref="chartContainer"
        style="width: 100%; height: 450px; margin: 0 auto"
      ></div>
      <!-- Custom Pagination -->
      <div
        class="pagination"
        v-if="activeFilter !== 'favorites' && !isLoading"
      >
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
import CmLoader from '../components/ui/loader/cm-loader.vue';
import {
  getImageCoin,
  getBigImageCoin,
} from '.././utils/helpers/formatter-images';

export default {
  components: {
    CmLoader,
  },
  data() {
    return {
      chart: null,
      cryptocurrencyData: [],
      originalData: [],
      activeFilter: '1h',
      globalPositions: [],
      favFilter: false,
      isLoading: true,
      currentPage: 1,
      totalPages: 1,
      bubblesPerPage: 35,
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
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    if (filter && this.filters.some((f) => f.value === filter)) {
      this.activeFilter = filter;
    }
    this.socket = io(configs.LOCAL_API_URL);
    this.socket.on('InitialTableListing', (initialData) => {
      this.cryptocurrencyData = initialData.data;
      this.originalData = [...this.cryptocurrencyData];
      this.calculateGlobalPositions();
      this.updatePagination();
      this.renderChart();
      this.startAnimation();
      this.isLoading = false;
      this.dataReceived = true;
    });

    this.socket.on('UpdatedTableListing', (updatedData) => {
      this.cryptocurrencyData = updatedData.data;
      this.originalData = [...this.cryptocurrencyData];
      this.updatePagination();
      this.renderChart();
      this.startAnimation();
      this.isLoading = false;
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

    reloadDataAfterDelay() {
      setTimeout(() => {
        this.filterData(this.activeFilter);
      }, 1000);
    },

    renderChart() {
      this.filterData(this.activeFilter);
    },

    startAnimation() {
      this.updateBubblePositions();
    },

    filterFavorites(data) {
      const favorites = this.getFavorites.map((favorite) => favorite.slug);
      return data.filter((item) => favorites.includes(item.slug));
    },

    filterData(interval) {
      this.activeFilter = interval;
      const imageUrl = this.getCoinImageUrl();

      if (interval === 'favorites') {
        this.favFilter == true;
        this.currentPage = 1;
        const favoriteData = this.filterFavorites(this.getFavorites);
        this.updateChart(favoriteData, imageUrl, true);
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
          };
        });
        this.updateChart(filteredData, imageUrl);
      }
    },
    calculateGlobalPositions() {
      const containerWidth = this.$refs.chartContainer.offsetWidth;
      let currentX = 0;
      let currentY = 0;
      let rowHeight = 0;
      this.originalData.forEach((crypto, i) => {
        const radius = this.getBubbleRadius(crypto);
        const diameter = radius * 2;

        if (currentX + diameter > containerWidth) {
          currentX = 0;
          currentY += rowHeight;
          rowHeight = 0;
        }

        this.globalPositions[i] = {
          x: currentX + radius,
          y: currentY + radius,
        };

        currentX += diameter;
        if (diameter > rowHeight) {
          rowHeight = diameter;
        }
      });
    },
    getBubbleRadius(crypto) {
      return 25;
    },
    updateChart(data, imageUrl, isFavorites = false) {
      let maxSizeConfig = isFavorites ? '130%' : '230%';
      const startIdx = isFavorites
        ? 0
        : (this.currentPage - 1) * this.bubblesPerPage;
      const endIdx = isFavorites
        ? data.length
        : Math.min(startIdx + this.bubblesPerPage, data.length);

      const processedData = data
        .slice(startIdx, endIdx)
        .map((crypto, index) => {
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
          const bubbleSize = this.calculateBubbleSize(crypto);

          const link = `https://www.coingecko.com/en/coins/${crypto.slug}`;

          let color;
          if (percentageChange >= 0) {
            color = {
              radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: [
                [0, 'rgba(6,199,110,0)'],
                [0.7, 'rgba(6,199,110,0.2)'],
                [1, 'rgba(6,199,110,1)'],
              ],
            };
          } else {
            color = {
              radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: [
                [0, 'rgba(200,42,78,0)'],
                [0.7, 'rgba(200,42,78,0.3)'],
                [1, 'rgba(200,42,78,1)'],
              ],
            };
          }
          const bubble = {
            name: crypto.symbol,
            value: bubbleSize,
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
            type: 'packedbubble',
            backgroundColor: '#06111d',
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
          stroke: {
            enabled: false,
          },
          xAxis: {
            visible: false,
          },
          yAxis: {
            visible: false,
          },
          plotOptions: {
            packedbubble: {
              minSize: '60%',
              maxSize: '170',
              layoutAlgorithm: {
                gravitationalConstant: 0.01,
                splitSeries: false,
                seriesInteraction: true,
                dragBetweenSeries: false,
                parentNodeLimit: false,
              },
              dataLabels: {
                enabled: true,
                useHTML: true,
                formatter: function () {
                  const maxImageSize = this.point.marker.radius * 0.8;
                  const minImageSize = 10;
                  const imageSize = Math.max(
                    Math.min(maxImageSize, this.point.marker.radius),
                    minImageSize
                  );

                  const fontSize = Math.max(this.point.marker.radius * 0.2, 5);
                  const changeColor =
                    parseFloat(this.point.change) >= 0
                      ? 'rgb(6,199,110)'
                      : 'rgb(200,42,78)';

                  return `
                          <div style="text-align:center; font-size:${fontSize}px;">
                              <img src="${this.point.image}" style="width:${imageSize}px; height:${imageSize}px; display:block; margin:auto; border-radius:50%;" alt="${this.point.name}">
                              <span style="font-size:180%; color: #fff; font-weight:500;">${this.point.name}</span><br>
                              <span style="font-size:120%; color: ${changeColor};">${this.point.change}</span>

                          </div>
                      `;
                },
                style: {
                  textOutline: 'none',
                  fontWeight: 'normal',
                  borderWidth: '0px',
                },
              },
              marker: {
                lineWidth: 0,
                lineColor: null,
              },
            },
          },
          series: [
            {
              data: processedData,
              point: {
                events: {
                  click: function () {
                    window.open(this.link, '_blank');
                  },
                  mouseOver: function () {
                    const hoveredChange = this.change;
                    const isPositiveHovered = hoveredChange.indexOf('-') === -1;
                    const series = this.series;

                    series.data.forEach(function (point) {
                      const isPositive = point.change.indexOf('-') === -1;

                      if (isPositiveHovered !== isPositive) {
                        point.graphic.css({ opacity: 0.3 });
                      }
                    });
                  },
                  mouseOut: function () {
                    const series = this.series;
                    series.data.forEach(function (point) {
                      point.graphic.css({ opacity: 1 });
                    });
                  },
                },
              },
            },
          ],
        });
      }
    },

    findMaxPercentChange() {
      let maxPercentChange = 0;

      this.originalData.forEach((crypto) => {
        [
          'percent_change_1h',
          'percent_change_24h',
          'percent_change_7d',
          'percent_change_30d',
        ].forEach((field) => {
          const percentChange = Math.abs(parseFloat(crypto[field] || 0));
          if (percentChange > maxPercentChange) {
            maxPercentChange = percentChange;
          }
        });
      });

      return maxPercentChange;
    },

    calculateBubbleSize(crypto) {
      let percentChangeKey = 'percent_change_24h';
      if (this.activeFilter && this.activeFilter !== 'favorites') {
        percentChangeKey = 'percent_change_' + this.activeFilter;
      }
      let percentChange = parseFloat(crypto[percentChangeKey]);
      if (isNaN(percentChange)) {
        percentChange = 0;
      }
      const rangeMultiplier = 20;
      const minBubbleSize = 50;
      let bubbleSize =
        Math.abs(percentChange) * rangeMultiplier + minBubbleSize;

      const maxSizeMultiplier = 0.8;
      const maxBubbleSize =
        this.$refs.chartContainer.offsetWidth * maxSizeMultiplier;

      if (bubbleSize > maxBubbleSize) {
        bubbleSize = maxBubbleSize;
      }

      return bubbleSize;
    },

    updateBubblePositions() {
      const containerWidth = this.chart.plotWidth;
      let currentX = 0;
      let currentY = 0;
      let rowHeight = 0;

      this.chart.series[0].data.forEach((point, i) => {
        const radius = point.marker.radius;
        const diameter = radius * 2;

        if (currentX + diameter > containerWidth) {
          currentX = 0;
          currentY += rowHeight;
          rowHeight = 0;
        }
        point.plotX = currentX + radius;
        point.plotY = currentY + radius;
        currentX += diameter;
        if (diameter > rowHeight) {
          rowHeight = diameter;
        }
        this.chart.series[0].points[i].update(
          {
            x: point.plotX,
            y: point.plotY,
          },
          false
        );
      });
      this.chart.redraw();
    },
    updatePagination() {
      this.totalPages = Math.ceil(
        this.originalData.length / this.bubblesPerPage
      );
      // Ensure current page is within bounds
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    gotoPage(pageNumber) {
      if (
        this.activeFilter !== 'favorites' &&
        pageNumber >= 1 &&
        pageNumber <= this.totalPages
      ) {
        this.renderPage();
        this.currentPage = pageNumber;
        this.filterData(this.activeFilter);
        this.updateBubblePositions();
      }
    },

    renderPage() {
      const pageData = this.cryptocurrencyData.slice(
        (this.currentPage - 1) * this.bubblesPerPage,
        this.currentPage * this.bubblesPerPage
      );
      this.updateChart(pageData, this.getCoinImageUrl());
    },

    gotoFirstPage() {
      if (this.currentPage != 1) {
        this.gotoPage(1);
      }
    },
    gotoLastPage() {
      if (this.currentPage < this.totalPages) {
        this.gotoPage(this.totalPages);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.filterData(this.activeFilter);
        this.updateBubblePositions();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.filterData(this.activeFilter);
        this.updateBubblePositions();
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
          imageUrls[crypto.slug] = getBigImageCoin(crypto.slug);
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
      immediate: true,
    },
  },
};
</script>

<style scoped>
.highchart-wrapper {
  background-color: #06111d;
  margin: 0px -20px;
  box-shadow: 0px 0px 0px 100vw #06111d;
}
.highchart-wrapper .cm-loader{
  margin-left:125px;
  margin-top:70px;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
  margin: 0 auto;
}

#highcharts-xx9ychm-387 {
  border: 1px solid rgba(1, 183, 255, 0.2);
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
  background-color: #0d2035;
  font-size: 12px;
  color: #2e628e;
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
  background-color: #132a44;
  color: #bbdbf7;
  font-weight: bold;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
}

.pagination button {
  background: transparent;
  font-size: 12px;
  color: #2e628e;
  padding: 0rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: 8px;
  border: none;
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: default;
  transition: all 0.3s ease-in-out 0s;
}

.pagination > span {
  padding: 0px 0px;
}

.pagination > span button {
  margin: 0px 0px;
}

.pagination button {
  cursor: pointer;
}

.pagination span {
}

.pagination button.active {
  background-color: #132a44;
  color: #bbdbf7;
  font-weight: bold;
}

.pagination button:disabled {
  pointer-events: none;
}
</style>
