<template>
  <div>
    <div class="alert-card">
      <p class="text text--caption m-0">
        New Coin <span class="ml-1 text-secondary">{{ name }}</span> was listed on the Cryptometric.
      </p>
    </div>
    <div class="alert-card__footer">
      <p class="m-0 d-flex justify-content-between align-items-start text text--caption">
        <default-image
          class="alert-card__icon"
          :src="getImageCoinUrl"
          alt="Coin"
        />
        <span class="ml-2">{{ symbol }}</span>
      </p>
      <p class="m-0 alert-card__date text">
        <span class="alert-card__date-icon">
          <icon-calendar class="alert-card__date-icon" />
        </span>
        <span class="ml-2">
          {{ formatDate }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { getImageCoin } from '@/utils/helpers/formatter-images';
import { format, parseISO } from 'date-fns';
import IconCalendar from '../icons/icon-calendar.vue';
import DefaultImage from '../default-image.vue';
export default {
  components: {
    IconCalendar,
    DefaultImage,
  },
  name: 'widget-alert-new-coin',
  props: {
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    slug: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  computed: {
    formatDate() {
      return format(parseISO(this.date), 'MMM dd');
    },
    getImageCoinUrl() {
      return getImageCoin(this.slug);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
