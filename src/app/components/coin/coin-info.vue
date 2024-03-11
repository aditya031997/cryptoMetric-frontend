<template>
  <div
    class="coin-info"
    v-if="description || features || technology"
  >
    <div class="coin-info__typography mt-n3">
      <h3
        class="m-0 mt-3 text coin-info__title"
        v-if="description"
      >
        Description
      </h3>
      <p
        class="m-0 mt-1 text coin-info__text"
        v-if="description"
        v-html="description"
      ></p>
      <h3
        class="m-0 mt-3 text coin-info__title"
        v-if="features"
      >
        Features
      </h3>
      <p
        class="m-0 mt-1 text coin-info__text"
        v-if="features"
        v-html="features"
      ></p>
      <h3
        class="m-0 mt-3 text coin-info__title"
        v-if="technology"
      >
        Technology
      </h3>
      <p
        class="m-0 mt-1 text coin-info__text"
        v-if="technology"
        v-html="technology"
      ></p>
    </div>
    <external-link
      :custom-class="'coin-info__link text'"
      :href="url"
    >
      {{ slug }}
      <icon-link />
    </external-link>
  </div>
  <p
    v-else
    class="text text-caption"
  >
    Sorry, no information found for this coin
  </p>
</template>

<script>
import IconLink from '../icons/icon-link.vue';
import externalLink from '../ui/link/external-link.vue';
export default {
  components: {
    externalLink,
    IconLink,
  },
  name: 'coin-info',
  props: {
    description: {
      type: String,
    },
    features: {
      type: String,
    },
    technology: {
      type: String,
    },
    url: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  methods: {
    formatterText(text) {
      return text.split('<p>').join('').split('</p>').join('');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
