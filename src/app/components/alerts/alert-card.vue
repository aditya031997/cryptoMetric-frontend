<template>
  <div
    class="alert-card"
    :class="{ 'is-line': isCardLine }"
  >
    <p class="text text--caption m-0">
      {{ name }}<span class="ml-1 text-secondary">{{ symbol }}</span>
      is
      {{ action === 2 ? 'down' : 'up' }}
      <span :class="action === 2 ? 'text-danger' : 'text-success'">
        {{ percentValue }}
      </span>
      to the last 24h
    </p>
    <div class="alert-card__footer">
      <div class="d-flex justify-content-between align-items-center overflow-hidden">
        <span class="alert-card__date-icon">
          <component :is="action === 2 ? 'icon-percent-down' : 'icon-percent-up'" />
        </span>
        <popper-tooltip
          :placement="'top'"
          :customClass="'m-0 ml-2 text text--caption text-truncate'"
        >
          {{ priceValue }}
          <template v-slot:popper>{{ formatDefaultPrice }}</template>
        </popper-tooltip>
      </div>
      <p class="m-0 ml-2 alert-card__date">
        <span class="alert-card__date-icon">
          <icon-calendar class="alert-card__date-icon" />
        </span>
        <span class="ml-1">
          {{ formatDate }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { formatPrice, formatPercent, simpleFormatPrice } from '@/utils/helpers/formatter';
import { format, parseISO } from 'date-fns';
import IconCalendar from '@/components/icons/icon-calendar.vue';
import IconPercentDown from '@/components/icons/icon-percent-down.vue';
import IconPercentUp from '@/components/icons/icon-percent-up.vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import CmLink from '../ui/link/cm-link.vue';
export default {
  components: {
    IconPercentDown,
    IconPercentUp,
    IconCalendar,
    PopperTooltip,
    CmLink,
  },
  name: 'widget-alert-card',
  props: {
    name: { type: String },
    symbol: { type: String },
    action: {
      type: Number,
    },
    percent: {
      type: [String, Number],
    },
    price: {
      type: [String, Number],
    },
    date: {
      type: String,
    },
    isCardLine: {
      type: Boolean,
    },
    currency: {
      type: Number,
    },
  },
  computed: {
    getLink() {
      return `crypto-markets/${this.slug}`;
    },
    percentValue() {
      const percent = `${this.action === 2 ? '-' : ''}${this.percent}`;
      return formatPercent(percent);
    },
    priceValue() {
      return formatPrice(this.price, this.currency ? ' BTC' : '$', !this.currency);
    },
    formatDefaultPrice() {
      return simpleFormatPrice(this.price, this.currency ? ' BTC' : '$', !this.currency);
    },
    formatDate() {
      return format(parseISO(this.date), 'MMM dd');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
