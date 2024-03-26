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
        style="width: 1400px; max-width: 100%; height: 360px; margin: 0 auto"
      ></div>
      <!-- Custom Pagination -->
      <div
        class="pagination"
        v-if="activeFilter !== 'favorites'"
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
import { getImageCoin, getBigImageCoin } from '.././utils/helpers/formatter-images';

export default {
  data() {
    return {
      chart: null,
      cryptocurrencyData: [],
      originalData: [],
      activeFilter: '1h',
      globalPositions: [],
      favFilter: false,
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
      // setInterval(() => {
      this.updateBubblePositions();
      // }, 1000);
    },

    filterFavorites(data) {
      const favorites = this.getFavorites.map((favorite) => favorite.slug);
      return data.filter((item) => favorites.includes(item.slug));
    },

    filterData(interval) {
      this.activeFilter = interval;

      const url = new URL(window.location.href);
      url.searchParams.set('filter', interval);
      window.history.pushState({ path: url.href }, '', url.href);

      const imageUrl = this.getCoinImageUrl();
      let maxSize;

      if (interval === 'favorites') {
        this.favFilter == true;
        this.currentPage = 1; // Reset to the first page
        const favoriteData = this.filterFavorites(this.getFavorites);
        this.updateChart(favoriteData, imageUrl, true);
      } else {
        const filteredData = this.originalData.map((item) => {
          let percentageChange;
          switch (interval) {
            case '1h':
              percentageChange = parseFloat(item.percent_change_1h);
              maxSize = '400%';
              break;
            case '24h':
              percentageChange = parseFloat(item.percent_change_24h);
              maxSize = '210%';
              break;
            case '7d':
              percentageChange = parseFloat(item.percent_change_7d);
              maxSize = '280%';
              break;
            case '30d':
              percentageChange = parseFloat(item.percent_change_30d);
              maxSize = '190%';
              break;
            case 'favorites':
              maxSize = '130%';
              break;
            default:
              maxSize = '130%';
              break;
          }
          const change = isNaN(percentageChange) ? 'N/A' : percentageChange.toFixed(2);

          return {
            ...item,
            percent_change: change,
            // imageUrl: imageUrl,
          };
        });
        this.updateChart(filteredData, imageUrl, maxSize);
      }
    },
    calculateGlobalPositions() {
      // Pre-calculate positions for all bubbles once
      const containerWidth = this.$refs.chartContainer.offsetWidth;
      let currentX = 0;
      let currentY = 0;
      let rowHeight = 0;

      // Use originalData since it should contain all bubbles
      this.originalData.forEach((crypto, i) => {
        const radius = this.getBubbleRadius(crypto);
        const diameter = radius * 2;

        if (currentX + diameter > containerWidth) {
          currentX = 0;
          currentY += rowHeight;
          rowHeight = 0;
        }

        this.globalPositions[i] = {
          x: currentX + radius, // Center of the bubble
          y: currentY + radius, // Center of the bubble
        };

        currentX += diameter;
        if (diameter > rowHeight) {
          rowHeight = diameter;
        }
      });
    },
    getBubbleRadius(crypto) {
      // Implement logic to determine the bubble radius
      // This can be a fixed value or calculated based on some property
      return 25; // Example fixed radius
    },
    updateChart(data, imageUrl, maxSize, isFavorites = false) {
      let maxSizeConfig = isFavorites ? '130%' : '230%';
      const startIdx = isFavorites ? 0 : (this.currentPage - 1) * this.bubblesPerPage;
      const endIdx = isFavorites ? data.length : Math.min(startIdx + this.bubblesPerPage, data.length);

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
          case 'favorites':
            percentageChange = parseFloat(crypto.percent_change_24h);
            break;
          default:
            percentageChange = NaN;
            break;
        }
        const bubbleSize = this.calculateBubbleSize(crypto);
        const favBubbleSize = this.calculateBubbleSize(crypto) / 2;

        const link = `https://www.coingecko.com/en/coins/${crypto.slug}`;

        let color;
        if (percentageChange >= 0) {
          color = {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
            stops: [
              // [0, 'rgba(33,128,81,0.5)'],
              // [0.8, 'rgba(33,128,81,0.5)'],
              // [1, 'rgba(33,128,81,0.6)'],
              [0, 'rgba(33,128,81,0.45)'],
              [0.8, 'rgba(33,128,81,0.45)'],
              [1, 'rgba(33,128,81,1)'],
            ],
          };
        } else {
          color = {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
            stops: [
              // [0, 'rgba(141,38,56,0.2)'],
              // [0.8, 'rgba(141,38,56,0.2)'],
              // [1, 'rgba(141,38,56,0.65)'],
              [0, 'rgba(141,38,56,0.2)'],
              [0.8, 'rgba(141,38,56,0.2)'],
              [1, 'rgba(141,38,56,0.85)'],
            ],
          };
        }
        const bubble = {
          name: crypto.symbol,
          value: this.activeFilter == 'favorites' ? favBubbleSize : bubbleSize, // Set 'value' instead of 'z' for packedbubble chart
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
            backgroundColor: 'rgba(1, 183, 255, 0.1)',
            // plotBorderColor: '#000000',
            // plotBorderWidth: 1,
            events: {
              load: function () {
                const spans = document.querySelectorAll('.highcharts-label span');
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
            packedbubble: {
              minSize: '70%',
              maxSize: '190%',
              layoutAlgorithm: {
                gravitationalConstant: 0.02,
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
                  const imageSize = Math.max(Math.min(maxImageSize, this.point.marker.radius), minImageSize);

                  const fontSize = Math.max(this.point.marker.radius * 0.2, 5);

                  return `
                                <div style="text-align:center; font-size:${fontSize}px;">
                                    <img src="${this.point.image}" style="width:${imageSize}px; height:${imageSize}px; display:block; margin:auto;" alt="${this.point.name}">
                                    <span>${this.point.name}</span><br>
                                    <span>${this.point.change}</span>
                                </div>
                            `;
                },

                style: {
                  textOutline: 'none',
                  fontWeight: 'normal',
                },
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

                      // Dim non-hovered category bubbles and hide their data labels
                      if (isPositiveHovered !== isPositive) {
                        if (point.graphic) {
                          point.graphic.css({ opacity: 0.1 }); // Set a very low opacity for non-hovered category
                        }
                        if (point.dataLabel) {
                          point.dataLabel.css({ visibility: 'hidden' }); // Hide data label
                        }
                      }
                    });
                  },
                  mouseOut: function () {
                    const series = this.series;
                    series.data.forEach(function (point) {
                      // Restore opacity for all bubbles and show their data labels
                      if (point.graphic) {
                        point.graphic.css({ opacity: 1 }); // Restore full opacity on mouse out
                      }
                      if (point.dataLabel) {
                        point.dataLabel.css({ visibility: 'visible' }); // Show data label
                      }
                    });
                  },
                },
              },
            },
          ],
        });
      }
    },

    // Preprocessing step to find the max absolute percent change
    findMaxPercentChange() {
      let maxPercentChange = 0;

      this.originalData.forEach((crypto) => {
        ['percent_change_1h', 'percent_change_24h', 'percent_change_7d', 'percent_change_30d'].forEach((field) => {
          const percentChange = Math.abs(parseFloat(crypto[field] || 0));
          if (percentChange > maxPercentChange) {
            maxPercentChange = percentChange;
          }
        });
      });

      return maxPercentChange;
    },

    calculateBubbleSize(crypto) {
      // Get the percentage change based on the active filter
      let percentChange = parseFloat(crypto['percent_change_' + this.activeFilter]);
      if (isNaN(percentChange)) {
        percentChange = 0; // Default to 0 if no valid percent change is found
      }

      // You can adjust the rangeMultiplier to scale the size of the bubbles
      // If you find the bubbles too small, increase this value, or if too big, decrease it.
      const rangeMultiplier = 20; // This is an arbitrary value, adjust it as necessary

      // The minimum size for a bubble (in pixels)
      const minBubbleSize = 5; // Change this to set the minimum bubble size

      // Calculate the bubble size, ensuring it's not below the minimum
      let bubbleSize = Math.abs(percentChange) * rangeMultiplier + minBubbleSize;

      // This is to ensure that the bubble sizes are not more than the container can hold
      // maxSizeMultiplier should be based on your data and how much of the container you want to fill
      const maxSizeMultiplier = 0.8; // This means the largest bubble can take up to 80% of the chart
      const maxBubbleSize = this.$refs.chartContainer.offsetWidth * maxSizeMultiplier;

      // Make sure the bubbleSize does not exceed maxBubbleSize
      if (bubbleSize > maxBubbleSize) {
        bubbleSize = maxBubbleSize;
      }

      return bubbleSize;
    },

    updateBubblePositions() {
      const containerWidth = this.chart.plotWidth;
      let currentX = 0; // Starting X position
      let currentY = 0; // Starting Y position
      let rowHeight = 0;

      this.chart.series[0].data.forEach((point, i) => {
        const radius = point.marker.radius;
        const diameter = radius * 2;

        // Check if the bubble fits in the current row, otherwise move to the next row
        if (currentX + diameter > containerWidth) {
          currentX = 0; // Reset X position for new row
          currentY += rowHeight; // Move Y to the next row
          rowHeight = 0; // Reset the tallest bubble height for the new row
        }

        // Update bubble position
        point.plotX = currentX + radius; // Center of the bubble
        point.plotY = currentY + radius; // Center of the bubble

        // Update currentX to the right edge of the current bubble
        currentX += diameter;

        // Keep track of the tallest bubble in the current row
        if (diameter > rowHeight) {
          rowHeight = diameter;
        }

        // Update the point in the series
        this.chart.series[0].points[i].update(
          {
            x: point.plotX,
            y: point.plotY,
          },
          false
        );
      });

      // Redraw the chart to reflect new positions
      this.chart.redraw();
    },
    updatePagination() {
      // Calculate total pages based on the length of data and bubblesPerPage
      this.totalPages = Math.ceil(this.originalData.length / this.bubblesPerPage);
      // Ensure current page is within bounds
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    gotoPage(pageNumber) {
      if (this.activeFilter !== 'favorites' && pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.renderPage();
        this.currentPage = pageNumber;
        this.filterData(this.activeFilter);
        this.updateBubblePositions();
      }
    },

    renderPage() {
      // Get a slice of the data for the current page
      const pageData = this.cryptocurrencyData.slice(
        (this.currentPage - 1) * this.bubblesPerPage,
        this.currentPage * this.bubblesPerPage
      );
      this.updateChart(pageData, this.getCoinImageUrl());
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
#highcharts-xx9ychm-387 {
  /* border: none; */
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
  gap: 5px;
  margin-top: 15px;
}

.pagination button {
  background: transparent;
  font-size: 12px;
  color: #444;
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
  background-color: rgba(1, 183, 255, 0.2);
  color: #222;
  font-weight: bold;
}

.pagination button:disabled {
  pointer-events: none;
}
</style>
