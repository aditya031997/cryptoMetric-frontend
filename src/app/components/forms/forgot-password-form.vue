<template>
  <div class="auth-form auth-form--reset-password">
    <div class="auth-form__wrapper">
      <cm-logo />
      <h1 class="auth-form__title text text--title-2 text-cod-grey">Password Recovery</h1>
      <validation-observer
        ref="validator"
        v-slot="{ handleSubmit, invalid }"
      >
        <form @submit.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="email"
            rules="required|email"
            v-slot="{ errors }"
          >
            <cm-input
              class-wrapper="mt-3"
              id="input-email"
              label="Email"
              :error="errors[0]"
              sub-text="Instructions for password recovery will be sent here"
              v-model="emailValue"
            />
          </validation-provider>
          <cm-button
            custom-class="mt-4"
            is-block
            :disabled="isLoad || invalid"
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
              Not on Cryptometric yet?<cm-link :to="'/register'">Create Account</cm-link>
            </p>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmLink from '../ui/link/cm-link.vue';
import CmButton from '../ui/button/cm-button.vue';
import CmInput from '../ui/input/cm-input.vue';
import CmLogo from '../cm-logo.vue';
export default {
  name: 'forgot-password-form',
  components: {
    ValidationProvider,
    ValidationObserver,
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
    responseMessage: '',
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
    onSubmit() {
      const data = {
        email: this.emailValue,
      };
      this.isLoad = true;
      this.$api
        .post('/forgot-password', data)
        .then(() => {
          this.responseMessage = 'The letter has been mailed';
        })
        .catch((errors) => {
          if (typeof errors === 'string' || errors.status) {
            if (errors.status) {
              this.errorMessage = errors.status;
            } else {
              this.errorMessage = errors;
            }
          } else {
            if (errors?.errors) {
              this.$refs.validator.setErrors({ ...errors.errors });
            } else {
              this.errorMessage = 'Unexpected error occured';
            }
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
