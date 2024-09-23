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
            :type="passwordFieldType"
            v-model="passwordValue"
            @input="passwordValidation"
            :error="passwordError"
            placeholder="Enter your password"
          >
            <template #append>
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="password-toggle"
              >
                <icon-hide v-if="passwordFieldType === 'password'" />

                <icon-show v-else />
              </button>
            </template>
          </cm-input>
          <ErrorMessage name="password" />
          <cm-input
            classWrapper="mt-3"
            id="input-confirm-password"
            label="Confirm Password"
            :type="passwordConfirmFieldType"
            v-model="passwordConfirmValue"
            @input="passwordConfirmValidation"
            :error="passwordConfirmError"
            placeholder="Enter your confirm password"
          >
            <template #append>
              <button
                type="button"
                @click="togglePasswordConfirmVisibility"
                class="password-toggle"
              >
                <icon-hide v-if="passwordConfirmFieldType === 'password'" />

                <icon-show v-else />
              </button>
            </template>
          </cm-input>
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
import CmLink from '../ui/link/cm-link.vue';
import CmButton from '../ui/button/cm-button.vue';
import CmInput from '../ui/input/cm-input.vue';
import CmLogo from '../cm-logo.vue';
import IconShow from '../icons/icon-show-password.vue';
import IconHide from '../icons/icon-hide-password.vue';
import { useNotification } from '@kyvg/vue3-notification';

const notification = useNotification();

export default {
  name: 'reset-password-form',
  components: {
    ValidationObserver,
    ErrorMessage,
    CmLink,
    CmButton,
    CmInput,
    CmLogo,
    IconShow,
    IconHide,
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
    passwordFieldType: 'password',
    passwordConfirmFieldType: 'password',
    hasTypedInConfirmPassword: false,
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
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    togglePasswordConfirmVisibility() {
      this.passwordConfirmFieldType =
        this.passwordConfirmFieldType === 'password' ? 'text' : 'password';
    },
    passwordValidation(event) {
      if (event !== '') {
        this.passwordValue = event;
      }
      if (event === '') {
        this.passwordError = 'The password field is required';
      } else {
        this.passwordError = '';
      }

      // Trigger confirm password validation when password changes
      if (this.hasTypedInConfirmPassword) {
        this.passwordConfirmValidation(this.passwordConfirmValue);
      }
      this.validation();
    },
    passwordConfirmValidation(event) {
      this.hasTypedInConfirmPassword = true;
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
            const Msg = response;
            notification.notify({
              text: Msg,
              type: 'success',
              duration: 2000,
              speed: 1000,
              position: 'top right',
              classes: 'custom-notification',
            });
            this.responseMessage = response;
            this.$root.$emit('set-auth-loading', false);
            this.$router.push({ name: 'login' });
          })
          .catch((error) => {
            this.errorMessage =
              error.errors.password[0] || 'Something went wrong';
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
>
.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}
.password-toggle svg {
  width: 20px;
  height: 20px;
}
.custom-notification {
  margin-top: 20px;
}
</style>
