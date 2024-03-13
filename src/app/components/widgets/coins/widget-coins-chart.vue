<template>
  <chart-trading-view
    auto-init
    top-toolbar
    :style-area="false"
    :slug="coinSlug"
    :symbol="coinSymbol"
  />
</template>

<script>
import ChartTradingView from '@/components/charts/trading-view.vue';

export default {
  name: 'widget-coins-chart',
  components: { ChartTradingView },
  props: {
    coinSymbol: {
      type: String,
      required: true,
    },
    coinSlug: {
      type: String,
      required: true,
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
