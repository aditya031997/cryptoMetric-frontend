<template>
  <cm-card
    custom-class="widget-watchlist"
    title="Watchlist"
    :is-close-content="getFavorites.length === 0"
  >
    <template v-slot:nav>
      <widget-watchlist-options
        :is-edit-on="getFavorites.length > 1"
        :on-dnd-state="onDndState"
        :disable-dnd-state="disableDndState"
        :disable-dnd-save="disableDndSave"
      />
    </template>
    <draggable
      v-model="coinsList"
      @start="drag = true"
      @end="drag = false"
      v-bind="dndOptions"
      :disabled="dndDisabled"
      handle=".coin-stats__handle"
    >
      <transition-group
        class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 widget-watchlist__list"
        type="transition"
        name="flip-list"
      >
        <widget-watchlist-card
          v-for="coin in getFavorites"
          :key="coin.coin_id"
          :id="coin.coin_id"
          :slug="coin.slug"
          :coin-name="coin.name"
          :coin-symbol="coin.symbol"
          :percent="coin.percent_change_24h"
          :price="coin.price_usd"
          :coin="coin"
          :is-dnd="!dndDisabled"
        />
      </transition-group>
    </draggable>
  </cm-card>
</template>

<script>
import CmCard from '../../ui/card/cm-card.vue';
import WidgetWatchlistCard from './widget-watchlist-card.vue';
import WidgetWatchlistOptions from './widget-watchlist-options.vue';
import CmLoader from '../../ui/loader/cm-loader.vue';
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import { getListenerEcho, stopListenerEcho } from '../../../utils/echo';

export default {
  name: 'widget-watchlist',
  components: { CmCard, WidgetWatchlistCard, WidgetWatchlistOptions, CmLoader, draggable },
  data: () => ({
    isLoad: false,
    drag: false,
    dndDisabled: true,
    coins: [],
  }),
  computed: {
    dndOptions: () => ({
      animation: 200,
      group: 'description',
      ghostClass: 'ghost',
    }),
    coinsList: {
      get() {
        return this.$store.state.favorites.coins;
      },
      set(value) {
        this.$store.commit('updateFavorites', value);
      },
    },
    ...mapGetters(['getFavorites']),
  },
  methods: {
    onDndState() {
      this.dndDisabled = false;
      this.$store.commit('createCopyDndFavorites');
    },
    disableDndSave() {
      this.isLoad = true;
      this.dndDisabled = true;
      this.$store.dispatch('postFavoritesDND', this.$store.state.favorites.coins).finally(() => {
        this.isLoad = false;
      });
    },
    disableDndState() {
      this.$store.commit('cancelChangedDndFavorites');
      this.dndDisabled = true;
    },
  },
  mounted() {
    const src = 'https://ssl.gstatic.com/trends_nrtr/1420_RC05/embed_loader.js';
    const existedScript = document.querySelector(`[src="${src}"]`);

    if (!existedScript) {
      const head = document.head;
      const script = document.createElement('script', {});
      script.type = 'text/javascript';
      script.src = src;
      script.onload = () => {
        this.$store.commit('trendsLoaded');
      };
      head.appendChild(script);
    }
    getListenerEcho('CoinInfoUpdated', () => {
      this.$store.dispatch('getFavorites');
    });
  },
  beforeDestroy() {
    stopListenerEcho('CoinInfoUpdated');
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
