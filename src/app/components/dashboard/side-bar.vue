<template>
  <div
    class="side-bar__wrapper"
    :class="{ 'is-active': isOpenSideBar, 'is-sidebar': isSmallBar }"
    @click="closeSideBar"
  >
    <nav
      class="side-bar"
      :class="{ 'is-sidebar': isSmallBar, 'is-active': isOpenSideBar }"
      @click.stop="emitClose"
    >
      <div class="side-bar__logo">
        <cm-logo :isSmall="!isSmallBar" />
        <button-icon
          :on-click="closeSideBar"
          custom-class="side-bar__button-close"
        >
          <icon-close />
        </button-icon>
      </div>
      <div class="side-bar__links">
        <template v-for="link in links">
          <cm-link
            custom-class="side-bar__link mt-4"
            v-if="link.active && link.name !== 'Support'"
            :on-click="onClickLink"
            :key="link.id"
            :to="link.to"
          >
            <template v-slot:icon>
              <component :is="link.icon" />
            </template>
            <span
              class="side-bar__text"
              :class="{ 'side-bar__text--none': !isSmallBar }"
            >
              {{ link.name }}
            </span>
          </cm-link>
          <external-link
            :key="link.id"
            v-if="link.name === 'Support'"
            :href="'https://iman.zendesk.com/'"
            :custom-class="'cm-link side-bar__link mt-4'"
          >
            <component :is="link.icon" />
            <p class="cm-link__text">
              <span
                class="side-bar__text"
                :class="{ 'side-bar__text--none': !isSmallBar }"
              >
                {{ link.name }}
                <span class="side-bar__icon-support">
                  <icon-link />
                </span>
              </span>
            </p>
          </external-link>
        </template>
      </div>
      <div class="side-bar__button-utils">
        <button
          class="side-bar__button"
          @click="$emit('on-hide-side-bar')"
        >
          <component :is="!isSmallBar ? 'icon-sidebar-right' : 'icon-sidebar-left'" />
          <span
            class="ml-2 side-bar__text"
            :class="{ 'side-bar__text--none': !isSmallBar }"
          >
            Hide Menu
          </span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import IconUsers from '../icons/icon-users.vue';
import IconHome from '../icons/icon-home.vue';
import CmLink from '../ui/link/cm-link.vue';
import IconAlarm from '../icons/icon-alarm.vue';
import IconCalendar from '../icons/icon-calendar.vue';
import IconSupport from '../icons/icon-support.vue';
import IconHealth from '../icons/icon-health.vue';
import IconRadio from '../icons/icon-radio.vue';
import IconToken from '../icons/icon-token.vue';
import CmLogo from '../cm-logo.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import IconLink from '../icons/icon-link.vue';
import IconSidebarLeft from '../icons/icon-sidebar-left.vue';
import IconSidebarRight from '../icons/icon-sidebar-right.vue';
import IconClose from '../icons/icon-close.vue';
import iconSwap from '../icons/icon-swap.vue';
import ExternalLink from '../ui/link/external-link.vue';

export default {
  name: 'side-bar',
  components: {
    IconUsers,
    IconHome,
    CmLink,
    IconAlarm,
    IconCalendar,
    IconToken,
    IconSupport,
    IconHealth,
    IconRadio,
    CmLogo,
    ButtonIcon,
    IconLink,
    IconSidebarLeft,
    IconSidebarRight,
    IconClose,
    iconSwap,
    ExternalLink,
  },
  props: {
    isOpenSideBar: {
      type: Boolean,
      default: false,
    },
    onCloseSideBar: {
      type: Function,
    },
    onClickSideBar: {
      type: Function,
    },
    isSmallBar: {
      type: Boolean,
    },
  },
  computed: {
    links() {
      return [
        {
          id: 0,
          to: '/home',
          name: 'Home',
          icon: 'icon-home',
          active: true,
        },
        {
          id: 1,
          to: '/top-token-by-market-cap',
          name: 'Top Token',
          icon: 'icon-token',
          active: true,
        },
        {
          id: 2,
          to: '/users',
          name: 'Users',
          icon: 'icon-users',
          active: this.$store.state.user.data?.is_admin,
        },
        {
          id: 3,
          to: '/alerts',
          name: 'Alerts',
          icon: 'icon-alarm',
          active: true,
        },
        {
          id: 4,
          to: '/crypto-markets',
          name: 'Crypto Markets',
          icon: 'icon-health',
          active: true,
        },
        // {
        //   id: 5,
        //   to: '/ico-calendar',
        //   name: 'ICO Calendar',
        //   icon: 'icon-calendar',
        //   active: true,
        // },
      
        {
          id: 6,
          to: '/news',
          name: 'News',
          icon: 'icon-radio',
          active: true,
        },
        {
          id: 7,
          to: '/support',
          name: 'Support',
          icon: 'icon-support',
          active: true,
        },
        {
          id: 8,
          to: '/swap',
          name: 'Swap',
          icon: 'icon-swap',
          active: true,
        },
      ];
    },
  },
  methods: {
    getWindowSize() {
      return window.innerWidth;
    },
    emitClose() {
      this.$root.$emit('sidebar-click');
    },
    closeSideBar() {
      this.$emit('on-close-side-bar');
      this.$emit('on-hide-side-bar', true);
    },
    onClickLink() {
      if (this.getWindowSize() <= 991) {
        this.$emit('on-close-side-bar');
        this.$emit('on-hide-side-bar', true);
      }
    },
    onHideSideBar() {
      this.onHideSideBar();
    },
  },
  mounted() {
    const size = this.getWindowSize();
    if (size <= 991 && size >= 768) {
      this.closeSideBar();
    }
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
