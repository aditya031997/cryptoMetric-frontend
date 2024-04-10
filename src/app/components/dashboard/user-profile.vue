<template>
  <button
    class="user-profile"
    ref="profileEl"
    @click="togglePopper"
  >
    <div
      class="user-profile__image"
      :style="{ backgroundImage: getGradientByName(), color: getFontColorByName() }"
      alt="Profile"
    >
      {{ userName[0] }}
    </div>
    <div class="ml-1 user-profile__text--desktop">
      <p class="m-0 text--button">{{ userName }}</p>
      <p
        class="m-0 text text--caption text-left text-blue"
        v-if="isAdmin"
      >
        Admin
      </p>
    </div>
    <div
      class="user-profile__icon user-profile__icon--desktop"
      :class="{ 'is-active': show }"
    >
      <icon-arrow-bottom />
    </div>
    <Popper
      role="tooltip"
      placement="bottom-end"
      :options="{
        modifiers: { offset: { offset: '-0,10px' } },
      }"
      :has-arrow="false"
      :is-open="show"
      :anchor-el="$refs.profileEl"
      :on-close="closePopper"
    >
      <aside
        class="user-profile__popper"
        id="popper-content"
      >
        <popper-profile />
      </aside>
    </Popper>
  </button>
</template>

<script>
import { stringToColor, generateGradient, isDark } from '@/utils/helpers/colors';
import IconArrowBottom from '../icons/icon-arrow-bottom.vue';
import { Popper } from 'popper-vue';
import PopperProfile from '../poppers/popper-profile.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    IconArrowBottom,
    Popper,
    PopperProfile,
  },
  data: () => ({
    show: false,
  }),
  beforeMount() {
    this.$root.$on('sidebar-click', this.closePopper);
  },
  beforeDestroy() {
    this.$root.$off('sidebar-click', this.closePopper);
  },
  computed: {
    ...mapGetters({
      userName: 'getUserFullName',
    }),
    nameColor() {
      return stringToColor(this.userName);
    },
    nameGradient() {
      return generateGradient(this.nameColor) || {};
    },
    isAdmin() {
      return this.$store.state.user.data?.is_admin;
    },
  },
  methods: {
    getGradientByName() {
      return `linear-gradient(315deg, ${this.nameGradient.from}, ${this.nameGradient.to})`;
    },
    getFontColorByName() {
      return isDark(this.nameGradient?.from) ? '#fff' : null;
    },
    togglePopper() {
      this.show = !this.show;
    },
    closePopper() {
      this.show = false;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
