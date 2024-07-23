<template>
  <div class="mt-4 profile-forms profile-forms--admin">
    <div class="d-flex align-items-center">
      <icon-security class="text-secondary flex-shrink-1" />
      <h2 class="m-0 ml-2 text text--subtitile-1">Update user’s password</h2>
    </div>
    <validation-observer ref="validator">
      <form @submit.prevent="submitForm">
        <cm-input
          class-wrapper="mt-3"
          id="input-password"
          label="Password"
          type="password"
          v-model="password"
          :error="passwordError"
          @input="passwordValidation"
        />
        <ErrorMessage name="password" />

        <cm-input
          class-wrapper="mt-4"
          id="input-confirm-password"
          label="Confirm Password"
          type="password"
          v-model="passwordConfirm"
          @input="passwordConfirmValidation"
          :error="passwordConfirmError"
        />
        <ErrorMessage name="confirm password" />
        <cm-button
        :disabled="isValid"
          type="submit"
          is-block
          custom-class="mt-4"
        >
          Update
        </cm-button>
        <p
          v-if="message"
          class="mt-2 text text--caption text-success text-center"
        >
          {{ message }}
        </p>
        <p
          v-if="error"
          class="mt-2 text text--caption text-success text-center"
        >
          {{ error }}
        </p>
      </form>
    </validation-observer>
    <div
      v-if="isLoad"
      class="profile-forms__loader"
    >
      <cm-loader />
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ErrorMessage } from 'vee-validate';
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import iconSecurity from '../icons/icon-security.vue';
import CmButton from '../ui/button/cm-button.vue';
import CmInput from '../ui/input/cm-input.vue';
import CmLoader from '../ui/loader/cm-loader.vue';
import { validatePassword } from '../../utils/helpers/validate-password';
export default {
  components: {
    iconSecurity,
    CmInput,
    CmButton,
    ValidationObserver,
    ErrorMessage,
    // ValidationProvider,
    CmLoader,
  },
  data: () => ({
    isLoad: false,
    password: '',
    isValid: true,
    passwordConfirm: '',
    passwordError: '',
    passwordConfirmError: '',
    message: '',
    error: '',
  }),
  methods: {
    passwordValidation(event) {
      if (event !== '') {
        this.password = event;
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
        this.passwordConfirm = event;
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
        this.password &&
        !this.passwordConfirmError &&
        this.passwordConfirm
      ) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    submitForm() {
      if (validatePassword(this.password)) {
        this.error =
          'Password must have digits, uppercase, lowercase and non-alphanumeric symbols';
      } else {
        this.isLoad = true;
        this.$store
          .dispatch('adminUpdatePassword', {
            id: this.$route.params.user,
            passwords: {
              password: this.password,
              password_confirmation: this.passwordConfirm,
            },
          })
          .then((value) => {
            // this.$refs.validator.reset();
            this.password = '';
            this.passwordConfirm = '';
            this.message = value;
          })
          .catch((errors) => {
            if (typeof errors === 'string') {
              this.error = errors.message;
            } else {
              if (errors?.errors) {
                this.error = errors.message;
              } else {
                this.error = errors.message;
              }
            }
          })
          .finally(() => (this.isLoad = false));
      }
    },
    onChangePassword(value) {
      this.message = '';
      this.password = value;
    },
    onChangePasswordConfirm(value) {
      this.message = '';
      this.passwordConfirm = value;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
