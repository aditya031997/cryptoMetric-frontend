<template>
  <div
    class="widget-wrapper"
    :class="{ 'is-dnd': isDnd }"
  >
    <div class="widget-wrapper__header">
      <div class="d-flex align-items-center">
        <button-icon
          :on-click="removeWidgetOrder"
          custom-class="button-remove"
        >
          <icon-remove />
        </button-icon>
        <h3 class="widget-wrapper__title text m-0 ml-2">{{ setTitle }}</h3>
      </div>
      <button-icon :custom-class="'widget-wrapper__button-dnd'">
        <icon-scroll />
      </button-icon>
    </div>
    <div
      class="widget-wrapper__content"
      :class="{ [`${classContent}`]: classContent, 'is-dnd': isDnd }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import IconRemove from '../icons/icon-remove.vue';
import IconScroll from '../icons/icon-scroll.vue';
import buttonIcon from '../ui/button/button-icon.vue';
export default {
  components: { buttonIcon, IconRemove, IconScroll },
  name: 'widgets-dnd-wrapper',
  props: {
    widget: { type: Object },
    classContent: { type: String },
    isDnd: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    setTitle() {
      switch (this.widget.name) {
        case 'coins_alerts':
          return 'Coins/Alerts';
        case 'watchlist':
          return 'Watchlist';
        case 'gainers_losers':
          return 'Top gainers today/Top losers today';
        case 'news':
          return 'News';
      }
      return '';
    },
  },
  methods: {
    removeWidgetOrder() {
      this.$store.commit('deleteWidgetOrder', this.widget);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
