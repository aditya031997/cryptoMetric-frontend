<template>
  <tr class="table__row">
    <td class="d-flex align-items-center">
      <default-image
        class="table__row-icon"
        v-if="image"
        :src="getImageUrl"
        :alt="`${name} icon`"
      />
      <p class="m-0 ml-1 text">{{ name }}</p>
    </td>
    <td class="text">
      {{ priceValue }}
    </td>
  </tr>
</template>

<script>
import { formatPrice } from '@/utils/helpers/formatter';
import { getImageExchanges } from '@/utils/helpers/formatter-images';
import DefaultImage from '../../default-image.vue';

export default {
  components: { DefaultImage },
  props: {
    slug: {
      type: String,
      default: '',
    },
    name: {
      type: String,
    },
    volume: {
      type: [String, Number],
    },
    image: {
      type: String,
    },
  },
  computed: {
    priceValue() {
      return formatPrice(this.volume);
    },
    getImageUrl() {
      return getImageExchanges(this.image);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
