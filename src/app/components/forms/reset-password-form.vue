<template>
  <div class="auth-form auth-form--reset-password">
    <div class="auth-form__wrapper">
      <cm-logo />
      <h1 class="auth-form__title text text--title-2 text-cod-grey">
        Password Recovery
      </h1>
      <validation-observer ref="validator">
        <form @submit.prevent="onSubmit">
          <cm-input
            class-wrapper="mt-3"
            id="input-password"
            label="Password"
            type="password"
            v-model="passwordValue"
            @input="passwordValidation"
            :error="passwordError"
          />
          <ErrorMessage name="password" />
          <cm-input
            classWrapper="mt-3"
            id="input-confirm-password"
            label="Confirm Password"
            type="password"
            v-model="passwordConfirmValue"
            @input="passwordConfirmValidation"
            :error="passwordConfirmError"
          />
          <ErrorMessage name="password" />
          <cm-button
            custom-class="mt-4"
            is-block
            :disabled="isValid"
            type="submit"
          >
            Reset Password
          </cm-button>
          <p
            v-if="responseMessage"
            class="auth-form__response-message text--caption text text-success"
          >
            {{ responseMessage }}
          </p>
          <p
            v-if="errorMessage"
            class="auth-form__response-message text--caption text text-danger"
          >
            {{ errorMessage }}
          </p>
          <div class="mt-3">
            <p class="auth-form__link text--caption text">
              Already have an account?<cm-link :to="'/login'">Sign In</cm-link>
            </p>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ErrorMessage } from 'vee-validate';
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmLink from '../ui/link/cm-link.vue';
import CmButton from '../ui/button/cm-button.vue';
import CmInput from '../ui/input/cm-input.vue';
import CmLogo from '../cm-logo.vue';
import { validatePassword } from '../../utils/helpers/validate-password';

export default {
  name: 'reset-password-form',
  components: {
    // ValidationProvider,
    ValidationObserver,
    ErrorMessage,
    CmLink,
    CmButton,
    CmInput,
    CmLogo,
  },
  data: () => ({
    isLoad: false,
    responseMessage: '',
    errorMessage: '',
    email: '',
    token: '',
    isValid: true,
    passwordValue: '',
    passwordError: '',
    passwordConfirmError: '',
    passwordConfirmValue: '',
  }),
  watch: {
    isLoad() {
      this.$root.$emit('set-auth-loading', this.isLoad);
    },
    passwordValue() {
      this.responseMessage = '';
      this.errorMessage = '';
    },
    passwordConfirmValue() {
      this.responseMessage = '';
      this.errorMessage = '';
    },
  },
  beforeMount() {
    this.email = this.$route.query.email;
    this.token = this.$route.query.token;
    if (!this.email || !this.token) {
      this.$router.push({ name: 'login' });
    }
  },
  methods: {
    clearErrors() {
      this.$refs.passwordProvider.errors.length = 0;
      this.$refs.passwordProvider.isActive = false;
      this.$refs.passwordProvider.isActive = true;

      this.$refs.confirmationProvider.errors.length = 0;
      this.$refs.confirmationProvider.isActive = false;
      this.$refs.confirmationProvider.isActive = true;
    },
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
    onSubmit() {
      if (
        !this.passwordError &&
        this.passwordValue &&
        this.passwordConfirmValue &&
        !this.passwordConfirmError
      ) {
        const data = {
          email: this.email,
          token: this.token,
          password: this.passwordValue,
          password_confirmation: this.passwordConfirmValue,
        };
        this.isLoad = true;
        this.$api
          .post('/reset-password', data)
          .then((response) => {
            this.$root.$emit('set-auth-loading', false);
            this.responseMessage = response;
            this.$router.push({ name: 'login' });
          })
          .catch((response) => {
            if (response?.errors) {
              if (typeof response === 'string') {
                this.$refs.validator.setErrors({ password: [response] });
              } else {
                const { password, password_confirmation, ...other } =
                  response.errors;
                const errors = {};
                if (other) {
                  errors.password = Object.values(other).flat();
                }
                if (password) {
                  errors.password = [...errors.password, ...password];
                }
                if (password_confirmation) {
                  errors.password_confirmation = password_confirmation;
                }
                this.errorMessage = errors.message;
              }
            } else {
              this.errorMessage = errors.message;
            }
          })
          .finally(() => {
            this.isLoad = false;
          });
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
