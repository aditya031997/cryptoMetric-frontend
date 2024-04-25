<template>
  <tr class="table__row">
    <td>
      <cm-link
        :to="getLink(slug)"
        custom-class="table__row-alert--link"
        @click="navigateToLink(getLink(slug))"
      >
        <default-image
          class="table__image table__image--alerts"
          :src="getCoinImageUrl"
          alt="Coin"
        />
        <p class="m-0 table-col--name">{{ name }}</p>
        <p class="ml-2 table-col--symbol d-block d-xs-none">{{ symbol }}</p>
        <popper-tooltip class="table-col--symbol m-0 d-none d-xs-block">
          {{ symbol }}
          <template v-slot:popper>
            {{ name }}
          </template>
        </popper-tooltip>
      </cm-link>
    </td>
    <td class="text">
      <popper-tooltip
        placement="top"
        custom-class="text tables__popper m-0 table__row--alerts-text table__row--alerts-popper"
      >
        {{ priceValue }}
        <template v-slot:popper>{{ priceValue }}</template>
      </popper-tooltip>
    </td>
    <td class="text">
      <p class="m-0 d-flex d-sm-block justify-content-around">
        <component
          :is="action === 2 ? 'icon-percent-down' : 'icon-percent-up'"
        />
        <span class="ml-1 d-none d-sm-inline">{{
          action === 2 ? 'Decrease' : 'Increase'
        }}</span>
        <span></span>
      </p>
    </td>
    <td class="text">
      <button-icon
        :on-click="removeAlert"
        :custom-class="'button-remove'"
      >
        <icon-remove />
      </button-icon>
    </td>
  </tr>
</template>

<script>
import { getImageCoin } from '@/utils/helpers/formatter-images';
import buttonIcon from '../../ui/button/button-icon.vue';
import PopperTooltip from '../../poppers/popper-tooltip.vue';
import IconRemove from '../../icons/icon-remove.vue';
import IconPercentDown from '../../icons/icon-percent-down.vue';
import IconPercentUp from '../../icons/icon-percent-up.vue';
import { simpleFormatPrice } from '../../../utils/helpers/formatter';
import CmLink from '../../ui/link/cm-link.vue';
import DefaultImage from '../../default-image.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    buttonIcon,
    PopperTooltip,
    IconRemove,
    IconPercentUp,
    IconPercentDown,
    CmLink,
    DefaultImage,
  },
  props: {
    id: { type: Number },
    name: { type: String },
    symbol: { type: String },
    slug: { type: String },
    price: { type: [String, Number] },
    action: { type: Number },
    currency: { type: Number },
  },
  setup() {
    const router = useRouter();
    const getLink = (slug) => {
      return `/crypto-markets/${slug}`;
    };
    const navigateToLink = (link) => {
      router
        .push(link)
        .then(() => {})
        .catch((error) => {
          console.error('Navigation error:', error);
        });
    };

    return {
      getLink,
      navigateToLink,
    };
  },
  computed: {
    // getLink() {
    //   return `crypto-markets/${this.slug}`;
    // },
    priceValue() {
      return simpleFormatPrice(
        this.price,
        this.currency ? ' BTC' : '$',
        !this.currency
      );
    },
    getCoinImageUrl() {
      return getImageCoin(this.slug);
    },
  },
  methods: {
    removeAlert() {
      this.$store.dispatch('deleteAlertUser', this.id);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
