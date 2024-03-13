<template>
  <aside
    id="popper-content"
    class="overflow-hidden"
  >
    <span
      ref="anchorEl"
      class="popper-chart"
      :class="[customClass]"
      @click="() => {}"
      @mouseenter="openPopper"
      @mouseleave="closePopper"
    >
      <slot />
    </span>
    <div id="app">
      <Popper
        ref="popper"
        :role="'tooltip'"
        :placement="placement"
        :is-open="show"
        :anchor-el="$refs.anchorEl"
      >
        <aside
          class="popper-chart__popper"
          :class="[{ 'is-active': show, 'is-disabled': disabled }, theme ? `popper-chart__popper--${theme.toLowerCase()}` : '']"
          id="popper-content"
        >
          <chart-trading-view
            v-if="show"
            auto-init-simple
            ref="chart"
            class="tradingview-chart--rounded"
            top-toolbar
            :style-area="false"
            :slug="coin.slug"
            :symbol="coin.symbol"
            size="tradingview-chart-sm"
          />
        </aside>
      </Popper>
    </div>
  </aside>
</template>

<script>
import { Popper } from 'popper-vue';
import UserThemeMixin from '@/utils/mixins/user-theme';
import ChartTradingView from '@/components/charts/trading-view.vue';
import MobileCheckMixin from '@/utils/mixins/mobile-check';

export default {
  name: 'popper-chart',
  components: {
    Popper,
    ChartTradingView,
  },
  mixins: [UserThemeMixin, MobileCheckMixin],
  props: {
    customClass: { type: String },
    placement: { type: String, default: 'right' },
    disabled: { type: Boolean, default: false },
    coin: { type: Object, required: true },
  },
  data: () => ({ show: false }),
  methods: {
    openPopper() {
      this.show = true;
    },
    closePopper() {
      this.show = false;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
