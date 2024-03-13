<template>
  <div
    class="news-card"
    :class="{ 'is-widget': isWidget }"
  >
    <img
      class="news-card__image"
      :src="getImage"
      alt="News"
    />
    <div class="news-card__typography">
      <external-link
        custom-class="text text-medium news-card__title"
        :href="url"
      >
        {{ title }}
      </external-link>
      <p
        class="text-grey-dark text news-card__description"
        v-if="description"
      >
        {{ description }}
      </p>
      <div
        class="news-card__typography-footer"
        :class="{ 'mt-3': !description }"
      >
        <p
          v-if="resource"
          class="news-card__footer-text d-flex align-items text-uppercase text--caption text text-grey-dark"
        >
          <icon-global />
          <span class="ml-1">{{ resource }}</span>
        </p>
        <p class="news-card__footer-text d-flex align-items text--caption text news-card__icon text-grey-dark">
          <icon-calendar />
          <span class="ml-1">{{ dateValue }} ago</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { getImageNews } from '@/utils/helpers/formatter-images';
import IconCalendar from './icons/icon-calendar.vue';
import IconGlobal from './icons/icon-global.vue';
import ExternalLink from './ui/link/external-link.vue';

export default {
  name: 'news-card',
  components: {
    IconCalendar,
    IconGlobal,
    ExternalLink,
  },
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    resource: { type: [String, null] },
    image: {
      type: String,
    },
    dateCreated: {
      type: String,
    },
    isWidget: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getImage() {
      return getImageNews(this.image);
    },
    dateValue() {
      return formatDistanceToNowStrict(parseISO(this.dateCreated));
    },
  },
};
</script>
<style
  lang="scss"
  scoped
></style>
