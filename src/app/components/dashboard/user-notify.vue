<template>
  <div class="user-notify ml-3">
    <button class="user-notify__button">
      <icon-notify />
      <span class="user-notify__counter">2</span>
    </button>
    <Popper
      role="tooltip"
      placement="bottom"
      :modifiers="{
        arrow: false,
      }"
      :is-open="show"
      :anchor-el="$refs.profileEl"
      :on-close="closePopper"
    >
      <aside
        class="user-notify__popper"
        id="popper-content"
      >
        <popper-notify />
      </aside>
    </Popper>
  </div>
</template>

<script>
import { Popper } from 'popper-vue';
import iconNotify from '../icons/icon-notify.vue';
import PopperNotify from '../poppers/popper-notify.vue';

export default {
  components: {
    Popper,
    iconNotify,
    PopperNotify,
  },
  data: () => ({
    show: false,
  }),
  methods: {
    openPopper() {
      this.show = true;
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
