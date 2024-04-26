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
            id="input-email"
            label="Email"
            sub-text="Instructions for password recovery will be sent here"
            v-model="emailValue"
            @input="emailValidation"
            @change="emailValidation"
            :error="emailError"
          />
          <ErrorMessage name="email" />
          <cm-button
            custom-class="mt-4"
            is-block
            :disabled="isValid"
            type="submit"
          >
            Send Instructions
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
          <div class="mt-3">
            <p class="auth-form__link text--caption text">
              Not on Cryptometric yet?<cm-link :to="'/register'"
                >Create Account</cm-link
              >
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
export default {
  name: 'forgot-password-form',
  components: {
    ValidationObserver,
    ErrorMessage,
    CmLink,
    CmButton,
    CmInput,
    CmLogo,
  },
  data: () => ({
    isLoad: false,
    check: false,
    emailValue: '',
    errorMessage: '',
    emailError: '',
    responseMessage: '',
    isValid: true,
  }),
  watch: {
    emailValue() {
      this.responseMessage = '';
      this.errorMessage = '';
    },
    isLoad() {
      this.$root.$emit('set-auth-loading', this.isLoad);
    },
  },
  methods: {
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
    validation() {
      if (!this.emailError && this.emailValue) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    onSubmit() {
      if (!this.emailError && this.emailValue) {
        const data = {
          email: this.emailValue,
        };
        this.isLoad = true;
        this.$api
          .post('/forgot-password', data)
          .then((response) => {
            this.responseMessage = 'The letter has been mailed';
          })
          .catch((error) => {
            console.log(error, 'error');
            if (error) {
              this.errorMessage = error.status || 'Something went wrong';
            } else if (error.request) {
              this.errorMessage = 'No response received from the server';
            } else {
              this.errorMessage = error;
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
