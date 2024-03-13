<template>
  <div class="ml-n4 mb-3 d-flex align-items-center flex-wrap">
    <button-add-widget
      v-for="widget in getWidgetsList"
      :key="widget.id"
      class="ml-4 mt-2"
      @on-click="addWidgetToOrder(widget)"
    >
      <template v-if="widget.name === 'coins_alerts'">Coins/Alerts</template>
      <template v-if="widget.name === 'watchlist'">Watchlist</template>
      <template v-if="widget.name === 'gainers_losers'">Top gainers today and top losers today</template>
      <template v-if="widget.name === 'news'">News</template>
    </button-add-widget>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ButtonAddWidget from '../ui/button/button-add-widget.vue';
export default {
  components: { ButtonAddWidget },
  name: 'buttons-widgets',
  computed: {
    ...mapGetters(['getWidgetsList']),
  },
  methods: {
    addWidgetToOrder(widget) {
      this.$store.commit('addWidgetOrder', widget);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
