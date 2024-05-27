<template>
  <div v-if="!isLoad">
    <buttons-widgets v-if="isDnd" />
    <VueDraggable
      v-model="widgetsList"
      @start="drag = true"
      @end="drag = false"
      v-bind="dndOptions"
      :disabled="!isDnd"
      :scroll-sensitivity="500"
      :force-fallback="true"
      handle=".widget-wrapper__button-dnd"
    >
      <widgets-dnd-wrapper
        v-for="widget in getOrderWidgets"
        :key="widget.id"
        :is-dnd="isDnd"
        :widget="widget"
        :class-content="
          widget.name === 'gainers_losers' ? 'widget-tops' : 'mt-4'
        "
      >
        <template v-if="widget.name === 'coins_alerts'">
          <widget-coins />
          <widget-alert />
        </template>
        <widget-watchlist v-if="widget.name === 'watchlist'" />
        <template v-if="widget.name === 'gainers_losers'">
          <widget-top-gainers />
          <widget-top-losers />
        </template>
        <widget-news v-if="widget.name === 'news'" />
      </widgets-dnd-wrapper>
    </VueDraggable>
  </div>
  <cm-loader v-else />
</template>

<script>
import WidgetCoins from '../components/widgets/coins/widget-coins.vue';
import WidgetAlert from '../components/widgets/alerts/widget-alert.vue';
import CmLoader from '../components/ui/loader/cm-loader.vue';
import WidgetNews from '../components/widgets/news/widget-news.vue';
import ButtonsWidgets from '../components/widgets/buttons-widgets.vue';
import WidgetTopGainers from '../components/widgets/top-coins/widget-top-gainers.vue';
import WidgetTopLosers from '../components/widgets/top-coins/widget-top-losers.vue';
import WidgetsDndWrapper from '../components/widgets/widgets-dnd-wrapper.vue';
import WidgetWatchlist from '../components/widgets/watchlist/widget-watchlist.vue';
import { VueDraggable } from 'vue-draggable-plus';
import { mapGetters } from 'vuex';

export default {
  components: {
    WidgetAlert,
    CmLoader,
    WidgetNews,
    ButtonsWidgets,
    WidgetTopGainers,
    WidgetTopLosers,
    WidgetsDndWrapper,
    WidgetCoins,
    WidgetWatchlist,
    VueDraggable,
  },
  data: () => ({
    drag: false,
    isLoad: false,
    isDnd: false,
  }),
  computed: {
    dndOptions: () => ({
      animation: 200,
      group: 'description',
      ghostClass: 'ghost',
    }),
    widgetsList: {
      get() {
        return this.$store.state.widgets.order;
      },
      set(value) {
        this.$store.commit('updateWidgetsOrder', value);
      },
    },
    ...mapGetters(['getOrderWidgets']),
  },
  methods: {
    onDndMode() {
      this.isDnd = true;
      this.$store.commit('createCopyDnd');
    },
    offDndMode(isSave = false) {
      if (isSave) {
        this.isLoad = true;
        this.$store
          .dispatch(
            'changePositionOrderWidgets',
            this.$store.state.widgets.order
          )
          .finally(() => {
            this.isLoad = false;
          });
      } else {
        this.$store.commit('cancelChangedDnd');
      }
      this.isDnd = false;
    },
  },
  mounted() {
    this.isLoad = true;
    this.$store.dispatch('getOrderList').finally(() => {
      this.$store.dispatch('getWidgets').finally(() => {
        this.isLoad = false;
      });
    });
  },
  beforeMount() {
    this.$root.$on('onDndMode', this.onDndMode);
    this.$root.$on('offDndMode', this.offDndMode);
  },
  beforeDestroy() {
    this.$root.$off('onDndMode', this.onDndMode);
    this.$root.$off('offDndMode', this.offDndMode);
  },
  watch: {
    getOrderWidgets(newValue) {},
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
