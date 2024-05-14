<template>
  <div class="popper-profile ">
    <div class="user-profile__text--mobile">
      <p class="m-0 text--button">{{ getUserName }}</p>
      <p
        class="m-0 text text--caption text-center text-blue"
        v-if="isAdmin"
      >
        Admin
      </p>
    </div>
    <cm-link
      custom-class="popper-profile__link"
      :to="'/profile'"
    >
      <template v-slot:icon>
        <icon-user />
      </template>
      My Profile
    </cm-link>
    <div class="mt-4">
      <cm-switch
        custom-class="ml-2"
        v-model="switchValue"
        id="icons-visible"
        is-icons
        is-visible
      >
        <icon-sun />
        <icon-moon />
        <template v-slot:label>
          <icon-brush class="cursor-pointer" />
        </template>
      </cm-switch>
    </div>
    <button-icon
      custom-class="popper-profile__button"
      :on-click="signOut"
    >
      <icon-logout />
      <p class="m-0 ml-2">Sign Out</p>
    </button-icon>
  </div>
</template>

<script>
import IconBrush from '../icons/icon-brush.vue';
import IconSun from '../icons/icon-sun.vue';
import IconMoon from '../icons/icon-moon.vue';
import IconLogout from '../icons/icon-logout.vue';
import CmSwitch from '../ui/switch/cm-switch.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import CmLink from '../ui/link/cm-link.vue';
import IconUser from '../icons/icon-user.vue';

export default {
  name: 'popper-profile',
  components: {
    IconBrush,
    IconSun,
    IconMoon,
    IconLogout,
    CmSwitch,
    ButtonIcon,
    CmLink,
    IconUser,
  },
  props: {
    placement: { type: String, default: 'right' },
  },
  computed: {
    getUserName() {
      let name = `${this.$store.state.user.data?.firstname} ${this.$store.state.user.data?.lastname}`;
      if (name.length > 15) {
        return `${name.substring(0, 15)}... `;
      }
      return `${name}`;
    },
    isAdmin() {
      return this.$store.state.user.data?.is_admin;
    },
  },
  data: () => ({ isLoad: false, show: false, switchValue: false }),
  watch: {
    switchValue(value) {
      if (value) {
        this.isLoad = true;
        this.$store.dispatch('changeTheme', 2).finally(() => (this.isLoad = false));
      } else {
        this.isLoad = true;
        this.$store.dispatch('changeTheme', 1).finally(() => (this.isLoad = false));
      }
    },
  },
  methods: {
    openPopper() {
      this.show = true;
    },
    closePopper() {
      this.show = false;
    },
    signOut() {
      this.$api.accessToken.clear();
      // this.commit('setAuthUser', null);
      localStorage.clear();

      this.$router.push({ name: 'login' });
    },
  },
  mounted() {
    if (typeof this.$store.state.user.data?.chart_theme !== 'undefined') {
      if (this.$store.state.user.data.chart_theme === 1) {
        this.switchValue = false;
      } else {
        this.switchValue = true;
      }
    }
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
