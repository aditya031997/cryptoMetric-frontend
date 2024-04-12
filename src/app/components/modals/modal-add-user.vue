<template>
  <validation-observer
    ref="validator"
  >
    <form
      class="modal-user"
      @submit.prevent="formSubmit"
    >
      <!-- <validation-provider
        name="email"
        rules="required|email"
        v-slot="{ errors }"
      > -->
        <cm-input
          class-wrapper="mt-4"
          label="Email"
          v-model="email"
        />
        <ErrorMessage name="email" />
      <!-- </validation-provider> -->
      <cm-button
        type="submit"
        custom-class="mt-4"
        is-block
        :disabled="invalid"
      >
        Send
      </cm-button>
    </form>
    <div
      class="modal-user__wrapper-loader"
      v-if="isLoad"
    >
      <cm-loader />
    </div>
  </validation-observer>
</template>

<script>
import cmButton from '../ui/button/cm-button.vue';
import cmInput from '../ui/input/cm-input.vue';
import { ValidationObserver,ErrorMessage } from 'vee-validate';
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmLoader from '../ui/loader/cm-loader.vue';
export default {
  components: {
    cmInput,
    cmButton,
    ValidationObserver,
    // ValidationProvider,
    ErrorMessage,
    CmLoader,
  },
  props: {
    onClose: { type: Function },
  },
  data: () => ({
    isLoad: false,
    email: '',
    errorMessage: '',
  }),
  watch:{
    eamil(){
      this.errorMessage = '';
    }
  },
  methods: {
    formSubmit() {
      this.isLoad = true;
      this.$store
        .dispatch('postInviteUser', this.email)
        .then(({ status }) => {
          this.onClose()
        })
        .catch((errors) => {
          if (errors?.errors) {
            this.errorMessage = errors.message;
          } else {
            this.errorMessage = errors.message;
          }
        })
        .finally(() => {
          this.isLoad = false;
        });
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
