<template>
  <main v-if="isIframe">
    <h1 class="site-error">An error occured!</h1><h2 class="site-error">Cryptometric website can not be rendered inside iframe.</h2>
  </main>
  <layout v-else-if="!isLoad">
    <router-view />
  </layout>
  <cm-loader v-else />
</template>

<script>
import CmLoader from './components/ui/loader/cm-loader.vue';
import Layout from './layouts/layout.vue';
import roles from './router/roles';
export default {
  components: {
    CmLoader,
    Layout,
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
    
    if (!this.$store.state.user.data && this.$route?.meta?.requiresAuth) {
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
