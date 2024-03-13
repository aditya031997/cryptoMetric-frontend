<template>
  <div class="auth-form auth-form--login">
    <cm-logo />
    <h1 class="auth-form__title text text--title-2">Sign In</h1>
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
            v-model="emailValue"
          />
        </validation-provider>
        <validation-provider
          name="password"
          rules="required"
          v-slot="{ errors }"
        >
          <cm-input
            class-wrapper="mt-3"
            id="input-password"
            label="Password"
            :error="errors[0]"
            type="password"
            v-model="passwordValue"
          />
        </validation-provider>
        <cm-button
          custom-class="mt-4"
          is-block
          :disabled="isLoad || invalid"
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
        <!-- <div class="mt-3">
          <p class="auth-form__link text--caption text">
            Not on Cryptometric yet?<cm-link :to="'/register'">Create Account</cm-link>
          </p>
        </div> -->
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
import { ValidationObserver } from 'vee-validate';
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmLogo from '../cm-logo.vue';
import accessToken from '../../utils/helpers/access-token';

export default {
  components: {
    cmInput,
    CmLink,
    CmButton,
    ValidationProvider,
    ValidationObserver,
    CmLogo,
  },
  data: () => ({
    isLoad: false,
    emailValue: '',
    passwordValue: '',
    errorMessage: '',
  }),
  watch: {
    emailValue(value) {
      this.errorMessage = '';
    },
    passwordValue(value) {
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
        password: this.passwordValue,
      };
      this.isLoad = true;
      this.$api
        .post('/login', data)
        .then((data) => {
          accessToken.set(data.live.token, false);
          accessToken.set(data.local.token, true);
          // accessToken.set(data.local.token, data.local.data, true);
          // localStorage.setItem('userData', JSON.stringify(data.local.data));
          const userData = data.live.user;
          this.$store.commit('setUser', userData);
          window.location.reload();
          // this.$router.push({ name: 'dashboard-home' });
        })
        .catch((errors) => {
          if (typeof errors == 'string') {
            this.errorMessage = errors;
          } else {
            if (errors?.errors) {
              this.$refs.validator.setErrors({ ...errors.errors });
            } else {
              this.$refs.validator.setErrors({ email: ['Unexpected error occurred'] });
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
