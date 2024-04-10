<template>
  <header
    class="header-dashboard"
    :class="{ 'is-sidebar': isSideBar }"
  >
    <div class="header-dashboard__section">
      <button-icon
        custom-class="header-dashboard__button header-dashboard__button--burger"
        :on-click="onOpenSideBar"
      >
        <icon-burger />
      </button-icon>
      <button-icon
        v-if="this.$route.meta.isButtonBack"
        custom-class="header-dashboard__button"
        :on-click="onClickBack"
      >
        <icon-back />
      </button-icon>
      <h1 class="header-dashboard__title">
        <span
          v-if="!!getUserName"
          class="header-dashboard__title--name"
        >
          {{ getUserName }}
        </span>
        {{ titleHeader }}
      </h1>
    </div>
    <div class="header-dashboard__section">
      <dashboard-settings v-if="this.$route.meta.headerName === 'Home'" />
      <user-notify />
      <user-profile />
    </div>
  </header>
</template>

<script>
import iconBack from '../icons/icon-back.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import UserProfile from './user-profile.vue';
import UserNotify from './user-notify.vue';
import DashboardSettings from './dashboard-settings.vue';
import IconBurger from '../icons/icon-burger.vue';

export default {
  components: {
    iconBack,
    ButtonIcon,
    UserProfile,
    UserNotify,
    DashboardSettings,
    IconBurger,
  },
  props: {
    isSideBar: {
      type: Boolean,
    },
  },
  computed: {
    getUserName() {
      if (this.$route.meta.isUserNameHeader) {
        let name = this.$store.state.user.data?.firstname;
        if (name?.length > 8) {
          return `${name?.substring(0, 8)}...`;
        }
        return `${name}`;
      }
      return null;
    },
    titleHeader() {
      return this.$route.meta.headerName;
    },
  },
  methods: {
    onClickBack() {
      this.$router.go(-1);
    },
    onOpenSideBar(){
      this.$emit('on-open-side-bar')
    },
    onClickOpenSideBar() {
      this.$emit('on-hide-side-bar');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
