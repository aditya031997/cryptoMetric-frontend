<template>
  <button
    type="button"
    class="button-favorite"
    :class="{ 'is-active': isActive, 'is-short': isShort, 'is-load': isLoad }"
    @click.stop="handlerClick"
  >
    <icon-star />
    <span
      v-if="!isShort"
      class="ml-2"
    >
      {{ isActive ? 'Watchlist' : 'Add to Watchlist' }}
    </span>
  </button>
</template>

<script>
import IconStar from '../../icons/icon-star.vue';

export default {
  name: 'button-favorite',
  components: { IconStar },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    coin: {
      type: Object,
    },
    isShort: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isLoad: false,
  }),
  methods: {
    handlerClick() {
      this.isLoad = true;
      this.$store.dispatch('postChangeFavorite', { coin: this.coin, state: this.isActive }).finally(() => {
        this.isLoad = false;
      });
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
