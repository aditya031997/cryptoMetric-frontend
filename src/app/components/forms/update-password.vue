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
      <cm-input
        class-wrapper="mt-3"
        id="input-password"
        label="Password"
        type="password"
        v-model="passwordValue"
        @input="passwordValidation"
        :error="passwordError"
        placeholder="Enter your password"
      />
      <ErrorMessage name="password" />
      <cm-input
        class-wrapper="mt-3"
        id="input-confirm-password"
        label="Confirm Password"
        type="password"
        v-model="passwordConfirmValue"
        @input="passwordConfirmValidation"
        :error="passwordConfirmError"
        placeholder="Enter your confirm password"
      />
      <ErrorMessage name="passwordConfirm" />

      <cm-button
        :disabled="isValid"
        type="submit"
        is-block
        custom-class="mt-4"
      >
        Save
      </cm-button>
      <p
        v-if="responseMessage"
        class="mt-2 text text--caption text-success text-center"
      >
        {{ responseMessage }}
      </p>
      <p
        v-if="errorMessage"
        class="mt-2 text text--caption text-success text-center"
      >
        {{ errorMessage }}
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
import CmButton from '../ui/button/cm-button.vue';
import cmInput from '../ui/input/cm-input.vue';
import CmLoader from '../ui/loader/cm-loader.vue';
import { validatePassword } from '../../utils/helpers/validate-password';

export default {
  components: {
    cmInput,
    CmButton,
    ValidationObserver,
    ErrorMessage,
    CmLoader,
  },
  data: () => ({
    isLoad: false,
    passwordValue: '',
    isValid: true,
    passwordConfirmValue: '',
    passwordError: '',
    passwordConfirmError: '',
    responseMessage: '',
    errorMessage: '',
  }),
  methods: {
    passwordValidation(event) {
      if (event !== '') {
        this.passwordValue = event;
      }
      if (event === '') {
        this.passwordError = 'The password field is required';
        return;
      }
      this.passwordError = '';
      this.validation();
    },
    passwordConfirmValidation(event) {
      if (event !== '') {
        this.passwordConfirmValue = event;
      }
      if (event === '') {
        this.passwordConfirmError = 'The password field is required';
        return;
      }
      if (event !== this.passwordValue) {
        this.passwordConfirmError = 'The passwords do not match';
      } else {
        this.passwordConfirmError = '';
      }
      this.validation();
    },
    validation() {
      if (
        !this.passwordError &&
        this.passwordValue &&
        !this.passwordConfirmError &&
        this.passwordConfirmValue
      ) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    onSubmitForm() {
      if (validatePassword(this.password)) {
        this.error =
          'Password must have digits, uppercase, lowercase and non-alphanumeric symbols';
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
