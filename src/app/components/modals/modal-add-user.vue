<template>
  <validation-observer ref="validator">
    <form
      class="modal-user"
      @submit.prevent="formSubmit"
    >
      <cm-input
        class-wrapper="mt-4"
        id="input-email"
        label="Email"
        v-model="email"
        @input="emailValidation"
        @change="emailValidation"
        :error="emailError"
      />
      <ErrorMessage name="email" />
      <cm-button
        type="submit"
        custom-class="mt-4"
        is-block
        :disabled="isValid"
      >
        Send
      </cm-button>
      <p
        v-if="errorMessage"
        class="auth-form__response-message text--caption text text-danger"
      >
        {{ errorMessage }}
      </p>
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
import { ValidationObserver, ErrorMessage } from 'vee-validate';
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
    emailError: '',
    isValid: true,
  }),
  watch: {
    eamil() {
      this.errorMessage = '';
    },
  },
  methods: {
    emailValidation(event) {
      if (event !== '') {
        this.email = event;
      }
      if (!event) {
        this.emailError = ' The email field is required';
        this.errorMessage = '';
        return;
      }
      const regex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[a-zA-Z0-9]*$/;
      if (!regex.test(event)) {
        this.emailError = ' The email field must be a valid email ';
        this.errorMessage = '';
      } else {
        this.emailError = '';
      }
      this.validation();
    },
    validation() {
      if (!this.emailError && this.email) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    formSubmit() {
      this.isLoad = true;
      this.$store
        .dispatch('postInviteUser', this.email)
        .then(({ status }) => {
          this.onClose();
        })
        .catch((errors) => {
          if (errors) {
            this.errorMessage = errors.response.data.message
;
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
