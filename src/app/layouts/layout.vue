<template>
  <component :is="getLayout">
    <slot />
  </component>
</template>

<script>
import Auth from './auth.vue';
import Dashboard from './dashboard.vue';
import layouts from './layouts';

export default {
  components: {
    Dashboard,
    Auth,
  },
  name: 'layout',
  computed: {
    getLayout() {
      if (this.$route.meta.layout) {
        return this.$route.meta.layout;
      }
      return layouts.dashboard;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
