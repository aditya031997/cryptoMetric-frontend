<template>
  <div
    class="h-100 d-flex align-items-center justify-content-center"
    v-if="!isLoad"
  >
    <div>
      <h3
        class="text text-center"
        :class="{ 'text-danger': !isSuccess, 'text-success': isSuccess }"
      >
        {{ message }}
      </h3>
      <cm-link
        :to="'/home'"
        :custom-class="'d-block text-center'"
      >
        go to Home page
      </cm-link>
    </div>
  </div>
  <cm-loader v-else />
</template>

<script>
import CmLink from '../components/ui/link/cm-link.vue';
import cmLoader from '../components/ui/loader/cm-loader.vue';
export default {
  components: {
    cmLoader,
    CmLink,
  },
  data: () => ({
    isLoad: false,
    isSuccess: false,
    message: '',
  }),
  mounted() {
    const params = {
      id: this.$route.query.userId,
      signature: this.$route.query.signature,
    };
    this.isLoad = true;
    this.$store
      .dispatch('unsubscribeAlerts', params)
      .then(() => {
        this.message = 'Unsubscribing from alerts - successful';
        this.isSuccess = true;
      })
      .catch(() => {
        this.isSuccess = false;
        this.message = 'An error has occurred - please try again later';
      })
      .finally(() => {
        this.isLoad = false;
      });
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
