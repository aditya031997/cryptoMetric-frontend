<template>
  <div class="modal-accept">
    <cm-button
      :on-click="handlerYes"
      custom-class="mt-4"
      is-block
    >
      Yes, change
    </cm-button>
    <cm-button
      :on-click="handlerNo"
      custom-class="mt-4"
      is-outline
      is-block
    >
      No
    </cm-button>
  </div>
</template>

<script>
import cmButton from '../ui/button/cm-button.vue';
export default {
  name: 'modal-accept',
  components: { cmButton },
  props: {
    onClickYes: { type: Function },
    onClickNo: { type: Function },
  },
  methods: {
    handlerYes() {
      this.onClickYes();
    },
    handlerNo() {
      this.onClickNo();
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
