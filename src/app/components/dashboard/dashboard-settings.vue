<template>
  <div class="dashboard-settings">
    <button
      ref="settingsEl"
      @click="openSetting"
      class="dashboard-settings__button"
    >
      <icon-settings />
    </button>
    <div
      class="dashboard-settings__buttons-group"
      :class="{ 'is-active': show, 'dashboard-settings__buttons-group--desktop': true }"
    >
      <div class="dashboard-settings__button-option ml-3">
        <cm-button
          variant="secondary"
          size="sm"
          :on-click="closeAndSave"
        >
          <icon-save />
          <span class="ml-2">Save</span>
        </cm-button>
      </div>
      <div class="dashboard-settings__button-option ml-3">
        <cm-button
          variant="danger"
          is-outline
          size="sm"
          :on-click="closeSetting"
        >
          <icon-close-circle />
          <span class="ml-2">Cancel</span>
        </cm-button>
      </div>
    </div>
    <div class="dashboard-settings__popper">
      <Popper
        placement="left"
        :has-arrow="false"
        :is-open="show"
        :anchor-el="$refs.settingsEl"
      >
        <aside
          class="dashboard-settings__popper-wrapper"
          id="popper-content"
        >
          <cm-button
            custom-class="mt-1"
            variant="secondary"
            size="sm"
            is-block
            :on-click="closeAndSave"
          >
            <icon-save />
            <span class="ml-2">Save</span>
          </cm-button>
          <cm-button
            custom-class="mt-1"
            variant="danger"
            is-outline
            size="sm"
            :on-click="closeSetting"
            is-block
          >
            <icon-close-circle />
            <span class="ml-2">Cancel</span>
          </cm-button>
        </aside>
      </Popper>
    </div>
  </div>
</template>

<script>
import IconCloseCircle from '../icons/icon-close-circle.vue';
import IconSave from '../icons/icon-save.vue';
import IconSettings from '../icons/icon-settings.vue';
import CmButton from '../ui/button/cm-button.vue';
import { Popper } from 'popper-vue';
export default {
  components: { CmButton, IconCloseCircle, IconSettings, IconSave, Popper },
  data: () => ({
    show: false,
  }),
  methods: {
    openSetting() {
      this.show = true;
      this.$root.$emit('onDndMode');
    },
    closeAndSave() {
      this.show = false;
      this.$root.$emit('offDndMode', true);
    },
    closeSetting() {
      this.show = false;
      this.$root.$emit('offDndMode');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
