<template>
  <main v-if="isIframe">
    <h1 class="site-error">An error occured!</h1>
    <h2 class="site-error">
      Cryptometric website can not be rendered inside iframe.
    </h2>
  </main>
  <layout v-else-if="!isLoad">
    <router-view />
    <notifications width="24%" />
  </layout>
  <cm-loader v-else />
</template>

<script>
import CmLoader from './components/ui/loader/cm-loader.vue';
import Layout from './layouts/layout.vue';
import roles from './router/roles';

import { Notifications } from '@kyvg/vue3-notification';

export default {
  components: {
    CmLoader,
    Layout,
    Notifications,
  },
  name: 'App',
  data: () => ({
    isLoad: true,
    isIframe: false,
  }),
  methods: {
    pageRoleCheck() {
      const rolesRoute = this.$route.meta?.roles;
      if (rolesRoute && rolesRoute.includes(roles.admin)) {
        if (!this.$store.state.user.data?.is_admin) {
          return this.$router.push({ path: '/home' });
        }
      }
    },
  },
  beforeMount() {
    if (self !== top) {
      this.isIframe = true;
    }
  },
  mounted() {
    // if (!this.$store.state.user.data && this.$route?.meta?.requiresAuth) {
    if (!this.$store.state.user.data) {
      this.$store
        .dispatch('getUser')
        .then(() => {
          this.pageRoleCheck();
        })
        .finally(() => {
          this.isLoad = false;
        });
    } else {
      this.pageRoleCheck();
      this.isLoad = false;
    }
  },
};
</script>

<style
  lang="scss"
  scoped
>
.site-error {
  max-width: 75%;
  margin: 0 auto;
  text-align: center;
}
</style>
