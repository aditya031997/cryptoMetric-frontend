<template>
  <div
    class="watchlist-options"
    v-if="!isEdit"
  >
    <router-link
      is-outline
      class="btn btn-outline-primary watchlist-options__button watchlist-options__button--add text text--caption text-medium"
      :to="'/crypto-markets'"
    >
      <icon-add />
      Add Coin
    </router-link>
    <cm-button
      v-if="isEditOn"
      is-outline
      customClass="watchlist-options__button watchlist-options__button-edit text text--caption"
      size="sm"
      :on-click="onClickEdit"
    >
      <icon-edit />
      Edit
    </cm-button>
  </div>
  <div
    class="watchlist-options"
    v-else
  >
    <cm-button
      variant="secondary"
      size="sm"
      custom-class="watchlist-options__button"
      :onClick="onClickSave"
    >
      <icon-save />
      <span class="ml-2">Save</span>
    </cm-button>
    <cm-button
      variant="danger"
      custom-class="watchlist-options__button watchlist-options__button-cancel"
      is-outline
      size="sm"
      :on-click="disableEdit"
    >
      <icon-close-circle />
      <span class="ml-2">Cancel</span>
    </cm-button>
  </div>
</template>

<script>
import CmButton from '../../ui/button/cm-button.vue';
import IconAdd from '../../icons/icon-add.vue';
import IconEdit from '../../icons/icon-edit.vue';
import IconCloseCircle from '../../icons/icon-close-circle.vue';
import IconSave from '../../icons/icon-save.vue';
import CmLink from '../../ui/link/cm-link.vue';
export default {
  name: 'widget-watchlist-options',
  components: { CmButton, IconAdd, IconEdit, IconCloseCircle, IconSave, CmLink },
  props: {
    disableDndState: { type: Function },
    onDndState: { type: Function },
    disableDndSave: { type: Function },
    isEditOn: { type: Boolean, default: false },
  },
  data: () => ({
    isEdit: false,
  }),
  methods: {
    onClickSave() {
      this.isEdit = false;
      this.disableDndSave();
    },
    disableEdit() {
      this.isEdit = false;
      this.disableDndState();
    },
    onClickEdit() {
      this.isEdit = true;
      this.onDndState();
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
