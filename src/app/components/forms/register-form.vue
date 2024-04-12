<template>
  <div class="auth-form auth-form--create-user">
    <cm-logo />
    <h1 class="auth-form__title text text--title-2">Create Account</h1>
    <p class="auth-form__title text">Welcome to Cryptometric!</p>
    <div class="auth-form__wrapper">
      <validation-observer ref="validator">
        <form @submit.prevent="onSubmit">
          <!-- <validation-provider
            name="first-name"
            rules="required"
            v-slot="{ errors }"
          > -->
          <cm-input
            class-wrapper="mt-3"
            id="input-first-name"
            label="First Name"
            v-model="firstNameValue"
          />
          <ErrorMessage name="first-name" />
          <!-- </validation-provider>
          <validation-provider
            name="last-name"
            rules="required"
            v-slot="{ errors }"
          > -->
          <cm-input
            class-wrapper="mt-3"
            id="input-last-name"
            label="Last Name"
            v-model="lastNameValue"
          />
          <ErrorMessage name="last-name" />
          <!-- </validation-provider>
          <validation-provider
            name="email"
            rules="required|email"
            v-slot="{ errors }"
          > -->
          <cm-input
            class-wrapper="mt-3"
            id="input-email"
            label="Email"
            v-model="emailValue"
          />
          <ErrorMessage name="email" />
          <!-- </validation-provider>
          <validation-provider
            name="password"
            rules="required|min:8"
            v-slot="{ errors }"
            vid="password"
          > -->
          <cm-input
            class-wrapper="mt-3"
            id="input-password"
            label="Password"
            type="password"
            v-model="passwordValue"
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
            classWrapper="mt-3"
            id="input-confirm-password"
            label="Confirm Password"
            type="password"
            v-model="passwordConfirmValue"
          />
          <ErrorMessage name="password" />

          <!-- </validation-provider> -->
          <cm-button
            custom-class="mt-4"
            :disabled="invalid || isLoad"
            is-block
            type="submit"
          >
            Submit
          </cm-button>
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
import cmInput from '../ui/input/cm-input.vue';
import CmButton from '../ui/button/cm-button.vue';
import { ValidationObserver, ErrorMessage } from 'vee-validate';
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmLogo from '../cm-logo.vue';
import CmLink from '../ui/link/cm-link.vue';
import accessToken from '../../utils/helpers/access-token';
import { validatePassword } from '../../utils/helpers/validate-password';

export default {
  components: {
    cmInput,
    CmButton,
    // ValidationProvider,
    ValidationObserver,
    ErrorMessage,
    CmLogo,
    CmLink,
  },
  data: () => ({
    isLoad: false,
    firstNameValue: '',
    lastNameValue: '',
    emailValue: '',
    errorMessage: '',
    passwordValue: '',
    passwordConfirmValue: '',
  }),
  watch: {
    firstNameValue(value) {
      this.errorMessage = '';
    },
    lastNameValue(value) {
      this.errorMessage = '';
    },
    emailValue(value) {
      this.errorMessage = '';
    },
    passwordValue(value) {
      this.errorMessage = '';
    },
    passwordConfirmValue(value) {
      this.errorMessage = '';
    },
    isLoad() {
      this.$root.$emit('set-auth-loading', this.isLoad);
    },
  },
  methods: {
    onSubmit() {
      if (validatePassword(this.passwordValue)) {
        // this.$refs.validator.setErrors({
        //   password: [
        //     'Password must have digits, uppercase, lowercase and non-alphanumeric symbols',
        //   ],
        // });
        this.errorMessage = "Password must have digits, uppercase, lowercase and non-alphanumeric symbols"
      } else {
        const data = {
          name: `${this.firstNameValue} ${this.lastNameValue}`,
          email: this.emailValue,
          password: this.passwordValue,
          password_confirmation: this.passwordConfirmValue,
        };
        this.isLoad = true;
        this.$api
          .post('/register', data)
          .then((data) => {
            accessToken.set(data.token);
            this.$store.commit('setUser', data.user);
            this.$router.push({ name: 'dashboard-home' });
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
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
