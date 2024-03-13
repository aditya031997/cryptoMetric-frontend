<template>
  <cm-card
    custom-class="widget-news"
    title="Latest News"
    :is-load="isLoad"
    :is-close-content="getLengthNews === 0"
  >
    <template v-slot:nav>
      <div class="widget-news__nav">
        <router-link
          is-outline
          class="btn btn-outline-primary widget-news__button text text-medium text--caption"
          to="/news"
        >
          <icon-eye />
          View All
        </router-link>
        <div class="widget-news__arrow-group">
          <button-icon
            :disabled="getNewsCurrent === 1"
            custom-class="widget-news__arrow is-reverse"
            :on-click="onClickPrev"
          >
            <icon-arrow-horizontal />
          </button-icon>
          <button-icon
            :on-click="onClickNext"
            :disabled="getNewsCurrent === getNewsTotal"
            custom-class="widget-news__arrow"
          >
            <icon-arrow-horizontal />
          </button-icon>
        </div>
      </div>
    </template>
    <div class="widget-news__content">
      <news-card
        v-for="article in getLatestNews"
        :key="article.id"
        :date-created="article.created_at"
        :description="article.description"
        :image="article.image"
        :name-url="article.nameUrl"
        :title="article.title"
        :url="article.url"
        :resource="article.resource"
        is-widget
      />
    </div>
  </cm-card>
</template>

<script>
import IconEye from '../../icons/icon-eye.vue';
import ButtonIcon from '../../ui/button/button-icon.vue';
import CmButton from '../../ui/button/cm-button.vue';
import cmCard from '../../ui/card/cm-card.vue';
import NewsCard from '../../news-card.vue';
import IconArrowHorizontal from '../../icons/icon-arrow-horizontal.vue';
import { mapGetters } from 'vuex';
import { getListenerEcho, stopListenerEcho } from '@/utils/echo';

export default {
  components: { cmCard, ButtonIcon, CmButton, IconEye, NewsCard, IconArrowHorizontal },
  data: () => ({
    isLoad: false,
  }),
  computed: {
    ...mapGetters(['getLatestNews', 'getNewsTotal', 'getNewsCurrent']),
    getLengthNews() {
      return this.$store.state.latest.news.length;
    },
  },
  methods: {
    onClickNext() {
      this.isLoad = true;
      this.$store.dispatch('getLatestNews', this.$store.state.latest.current + 1).finally(() => {
        this.isLoad = false;
      });
    },
    onClickPrev() {
      this.isLoad = true;
      this.$store.dispatch('getLatestNews', this.$store.state.latest.current - 1).finally(() => {
        this.isLoad = false;
      });
    },
  },
  mounted() {
    this.isLoad = true;
    this.$store.dispatch('getLatestNews').finally(() => {
      this.isLoad = false;
    });
    getListenerEcho('NewsUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getLatestNews').finally(() => {
        this.isLoad = false;
      });
    });
  },
  beforeDestroy() {
    stopListenerEcho('NewsUpdated')
  }
};
</script>

<style
  lang="scss"
  scoped
></style>
