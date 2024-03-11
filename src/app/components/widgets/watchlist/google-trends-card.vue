<template>
  <div
    ref="card"
    class="chart-google"
    :class="{ 'is-auto': isAutoHeight }"
  ></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    symbol: {
      type: String,
    },
    isAutoHeight: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.isTrendsScriptLoaded) {
      this.init();
    }
  },
  methods: {
    init() {
      trends.embed.renderExploreWidgetTo(
        this.$refs.card,
        'TIMESERIES',
        {
          comparisonItem: [
            {
              keyword: this.symbol,
              geo: '',
              time: 'today 12-m',
            },
          ],
          category: 0,
          property: '',
        },
        {
          exploreQuery: 'q=' + this.symbol + '&date=today 12-m',
          guestPath: 'https://trends.google.com:443/trends/embed/',
        }
      );
    },
  },
  computed: {
    ...mapGetters({
      isTrendsScriptLoaded: 'getTrendsStatus',
    }),
  },
  watch: {
    isTrendsScriptLoaded(next) {
      if (next) {
        this.init();
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
