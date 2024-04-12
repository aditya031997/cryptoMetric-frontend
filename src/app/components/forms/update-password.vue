<template>
  <validation-observer
    ref="validator"
    class="profile-forms"
  >
    <form
      class="mt-5"
      @submit.prevent="onSubmitForm"
    >
      <h2 class="m-0 pb-4 text text--title-3 profile-forms__title">Security</h2>
      <!-- <validation-provider
        name="password"
        rules="required|min:8"
        v-slot="{ errors }"
        vid="password"
      > -->
      <cm-input
        class-wrapper="mt-3"
        id="input-password"
        label="Password"
        :is-error="!!password"
        type="password"
        v-model="password"
      />
      <ErrorMessage name="password" />

      <!-- </validation-provider>
      <validation-provider
        name="password"
        vid="password_confirmation"
        rules="required|confirmed:password"
        v-slot="{ errors }"
      > -->
      <cm-input
        class-wrapper="mt-3"
        id="input-confirm-password"
        label="Confirm Password"
        :is-error="!!passwordConfirm"
        type="password"
        v-model="passwordConfirm"
      />
      <ErrorMessage name="passwordConfirm" />

      <!-- </validation-provider> -->
      <cm-button
        :disabled="invalid"
        type="submit"
        is-block
        custom-class="mt-4"
      >
        Save
      </cm-button>
      <p
        class="mt-2 text text--caption text-success text-center"
        v-if="message"
      >
        {{ message }}
      </p>
      <p
        class="mt-2 text text--caption text-success text-center"
        v-if="error"
      >
        {{ error }}
      </p>
    </form>
    <div
      v-if="isLoad"
      class="profile-forms__loader"
    >
      <cm-loader />
    </div>
  </validation-observer>
</template>

<script>
import { ValidationObserver, ErrorMessage } from 'vee-validate';
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmButton from '../ui/button/cm-button.vue';
import cmInput from '../ui/input/cm-input.vue';
import CmLoader from '../ui/loader/cm-loader.vue';
import { validatePassword } from '../../utils/helpers/validate-password';

export default {
  components: {
    cmInput,
    CmButton,
    ValidationObserver,
    // ValidationProvider,
    ErrorMessage,
    CmLoader,
  },
  data: () => ({
    isLoad: false,
    password: '',
    passwordConfirm: '',
    message: '',
    error: '',
  }),
  methods: {
    onSubmitForm() {
      if (validatePassword(this.password)) {
        this.error = "Password must have digits, uppercase, lowercase and non-alphanumeric symbols"
      } else {
        this.isLoad = true;
        this.$store
          .dispatch('updatePassword', {
            password: this.password,
            password_confirmation: this.passwordConfirm,
          })
          .catch((errors) => {
            if (typeof errors === 'string') {
              this.error = errors;
            } else {
              if (errors?.errors) {
                this.error = errors.message;
              } else {
                this.error = errors.message;
              }
            }
          })
          .then((value) => {
            this.message = value;
            this.password = '';
            this.passwordConfirm = '';
          })
          .finally(() => (this.isLoad = false));
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
