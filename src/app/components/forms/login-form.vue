<template>
  <div class="auth-form auth-form--login">
    <cm-logo />
    <h1 class="auth-form__title text text--title-2">Sign In</h1>
    <validation-observer ref="validator">
      <form @submit.prevent="onSubmit">
        <cm-input
          class-wrapper="mt-3"
          id="input-email"
          label="Email"
          v-model="emailValue"
          @input="emailValidation"
          :error="emailError"
          placeholder="Enter your email"
        />

        <ErrorMessage name="email" />
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
        <cm-button
          custom-class="mt-4"
          is-block
          :disabled="isValid"
          type="submit"
        >
          Sign In
        </cm-button>
        <p
          v-if="errorMessage"
          class="m-0 mt-2 text-red text--caption-bold text-center"
        >
          {{ errorMessage }}
        </p>
        <!-- <p class="auth-form__link text--caption text">
          Not on Cryptometric yet?<cm-link :to="'/register'"
            >Create Account</cm-link
          >
        </p> -->
        <p class="auth-form__link text--caption text mt-3">
          <cm-link :to="{ name: 'forgot-password' }">Forgot Password?</cm-link>
        </p>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import cmInput from '../ui/input/cm-input.vue';
import CmLink from '../ui/link/cm-link.vue';
import CmButton from '../ui/button/cm-button.vue';
import { ValidationObserver, ErrorMessage } from 'vee-validate';
import CmLogo from '../cm-logo.vue';
import accessToken from '../../utils/helpers/access-token';
import IconShow from '../icons/icon-show-password.vue';
import IconHide from '../icons/icon-hide-password.vue';

export default {
  components: {
    cmInput,
    CmLink,
    CmButton,
    ErrorMessage,
    ValidationObserver,
    CmLogo,
    IconShow,
    IconHide,
  },
  data: () => ({
    isLoad: false,
    emailValue: '',
    passwordValue: '',
    errorMessage: '',
    emailError: '',
    passwordError: '',
    isValid: true,
    passwordFieldType: 'password', // initial password field type
  }),
  watch: {
    emailValue(value) {
      this.errorMessage = '';
    },
    passwordValue(value) {
      this.errorMessage = '';
    },
    isLoad(value) {
      this.$root.$emit('set-auth-loading', this.isLoad);
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    emailValidation(event) {
      if (event !== '') {
        this.emailValue = event;
      }
      if (!event) {
        this.emailError = ' The email field is required';
        return;
      }
      const regex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[a-zA-Z0-9]*$/;
      if (!regex.test(event)) {
        this.emailError = ' The email field must be a valid email ';
      } else {
        this.emailError = '';
      }
      this.validation();
    },
    passwordValidation(event) {
      this.passwordValue = event;

      if (event === '') {
        this.passwordError = 'The password field is required';
      } else {
        this.passwordError = '';
      }

      this.validation();
    },
    validation() {
      if (
        !this.passwordError &&
        !this.emailError &&
        this.passwordValue &&
        this.emailValue
      ) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    onSubmit() {
      if (
        !this.emailError &&
        !this.passwordError &&
        this.emailValue &&
        this.passwordValue
      ) {
        const data = {
          email: this.emailValue,
          password: this.passwordValue,
        };
        this.isLoad = true;
        this.$api
          .post('/login', data)
          .then((response) => {
            accessToken.set(response.live.token, false);
            accessToken.set(response.local.data.token, true);
            const userData = response.live.user;
            this.$store.commit('setUser', userData);
            window.location.reload();
          })
          .catch((error) => {
            if (typeof error == 'string') {
              this.errorMessage = error;
            } else {
              if (error?.errors) {
                this.errorMessage = error.message;
              } else {
                this.errorMessage = error.message;
              }
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

<style lang="scss" scoped>
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
</style>
