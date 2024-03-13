<template>
  <div
    v-if="!isLoad"
    class="dashboard"
  >
    <side-bar
      @on-close-side-bar="onCloseSideBar"
      @on-hide-side-bar="onHideSideBar"
      :is-open-side-bar="isSideBar"
      :is-small-bar="isSmallBar"
    />
    <div class="dashboard__content">
      <header-dashboard
        @on-hide-side-bar="onHideSideBar"
        @on-open-side-bar="onClickOpenSideBar"
        :is-side-bar="isSmallBar"
      />
      <main
        class="dashboard__main"
        :class="{ 'is-sidebar': isSmallBar }"
      >
        <slot />
      </main>
    </div>
  </div>
  <cm-loader v-else />
</template>

<script>
import HeaderDashboard from '../components/dashboard/header-dashboard.vue';
import SideBar from '../components/dashboard/side-bar.vue';
import CmLoader from '../components/ui/loader/cm-loader.vue';
export default {
  name: 'dashboard',
  components: {
    SideBar,
    HeaderDashboard,
    CmLoader,
  },
  data: () => ({
    isSideBar: false,
    isSmallBar: true,
    isLoad: true,
  }),
  methods: {
    onClickOpenSideBar() {
      this.isSideBar = true;
    },
    onCloseSideBar() {
      this.isSideBar = false;
    },
    onHideSideBar(state = !this.isSmallBar) {
      this.isSmallBar = state;
    },
  },
  mounted() {
    this.isLoad = true;
    this.$store.dispatch('getFavorites').then(() => {
      this.isLoad = false;
    });
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
