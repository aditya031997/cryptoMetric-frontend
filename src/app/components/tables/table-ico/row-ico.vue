<template>
  <tr class="">
    <td class="table-col">{{ id }}</td>
    <td class="table-col">
      <external-link
        class="d-inline-flex align-items-center table__link"
        :href="url"
      >
        <default-image
          class="table__image"
          :src="getFormatterImageIco"
          :alt="`Project ${shortName} icon`"
        />
        <span class="m-0 text text-cod-grey d-none d-sm-inline">{{ name }}</span>
        <span class="m-0 ml-1 text text-grey flex-shrink-1 d-flex align-items-center">
          {{ shortName }}
          <icon-link class="ml-1 flex-shrink-1" />
        </span>
      </external-link>
    </td>
    <td
      v-if="typeof priceIco !== 'undefined' && isActiveEnded"
      class="table-col"
    >
      {{ getFormatterPriceIco === null ? '-' : getFormatterPriceIco }}
    </td>
    <td
      v-if="typeof stage !== 'undefined'"
      class="table-col"
    >
      {{ stage === null ? '-' : stage }}
    </td>
    <td
      v-if="typeof dateStarted !== 'undefined'"
      class="table-col"
    >
      {{ getStartDate ? getStartDate : '-' }}
      <span
        v-if="getDateToStart"
        class="text text--caption text-grey"
      >
        starts in {{ getDateToStart }} days
      </span>
    </td>
    <td
      v-if="typeof dateEnd !== 'undefined'"
      class="table-col"
    >
      {{ getEndDate ? getEndDate : '-' }}
      <span
        v-if="getDateToFinish"
        class="text text--caption text-grey"
      >
        ends in {{ getDateToFinish }} days
      </span>
    </td>
    <td
      class="text text--caption text-grey"
      v-if="typeof goal !== 'undefined'"
    >
      {{ goal === null ? '-' : goal }}
    </td>
    <td class="d-sm-none d-xs-none"></td>
  </tr>
</template>

<script>
import { formatDistanceToNowStrict, format, parseISO } from 'date-fns';
import { formatPrice } from '../../../utils/helpers/formatter';
import { getImageIco } from '../../../utils/helpers/formatter-images';
import IconLink from '../../icons/icon-link.vue';
import externalLink from '../../ui/link/external-link.vue';
import DefaultImage from '../../default-image.vue';
export default {
  components: {
    externalLink,
    IconLink,
    DefaultImage,
  },
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    priceIco: {
      type: [Number, String],
    },
    shortName: {
      type: String,
    },
    dateStarted: {
      type: String,
    },
    stage: {
      type: String,
    },
    dateEnd: {
      type: String,
    },
    image: {
      type: String,
    },
    goal: {
      type: String,
    },
    isActiveEnded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getFormatterPriceIco() {
      if (!this.priceIco) {
        return null;
      }
      return formatPrice(this.priceIco);
    },
    getFormatterImageIco() {
      return getImageIco(this.image);
    },
    getStartDate() {
      if (!this.dateStarted) {
        return '';
      }
      return format(parseISO(this.dateStarted), 'MMM dd, yyyy');
    },
    getDateToStart() {
      if (!this.dateStarted) {
        return '';
      }
      const dateToStart = formatDistanceToNowStrict(parseISO(this.dateStarted), { unit: 'day' });
      const date = Number(dateToStart.split(' ')[0]) + 1;
      if (date < 14 && date > 0) {
        return date;
      }
      return null;
    },
    getEndDate() {
      if (!this.dateEnd) {
        return '';
      }
      return format(parseISO(this.dateEnd), 'MMM dd, yyyy');
    },
    getDateToFinish() {
      if (!this.dateEnd) {
        return '';
      }
      const dateToFinish = formatDistanceToNowStrict(parseISO(this.dateEnd), { unit: 'day' });
      const date = Number(dateToFinish.split(' ')[0]) + 1;
      if (date < 14 && date > 0) {
        return date;
      }
      return null;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
