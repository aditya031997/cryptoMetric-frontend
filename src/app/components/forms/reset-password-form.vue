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
            ref="passwordProvider"
            name="password"
            rules="required|min:8"
            v-slot="{ errors }"
            vid="password"
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
          <validation-provider
            ref="confirmationProvider"
            name="password"
            vid="password_confirmation"
            rules="required|confirmed:password"
            v-slot="{ errors }"
          >
            <cm-input
              classWrapper="mt-3"
              id="input-confirm-password"
              label="Confirm Password"
              :error="errors[0]"
              type="password"
              v-model="passwordConfirmValue"
            />
          </validation-provider>
          <cm-button
            custom-class="mt-4"
            is-block
            :disabled="isLoad || invalid"
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
import { ValidationObserver } from 'vee-validate';
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmLink from '../ui/link/cm-link.vue';
import CmButton from '../ui/button/cm-button.vue';
import CmInput from '../ui/input/cm-input.vue';
import CmLogo from '../cm-logo.vue';
import { validatePassword } from '../../utils/helpers/validate-password';

export default {
  name: 'reset-password-form',
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
    responseMessage: '',
    email: '',
    token: '',
    passwordValue: '',
    passwordConfirmValue: '',
  }),
  watch: {
    isLoad() {
      this.$root.$emit('set-auth-loading', this.isLoad);
    },
    passwordValue() {
      this.responseMessage = '';
    },
    passwordConfirmValue() {
      this.responseMessage = '';
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
    onSubmit() {
      if (validatePassword(this.passwordValue)) {
        this.$refs.validator.setErrors({
          password: ['Password must have digits, uppercase, lowercase and non-alphanumeric symbols'],
        });
      } else {
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
            // this.passwordValue = '';
            // this.passwordConfirmValue = '';
            // setTimeout(() => {
            //   this.clearErrors();
            // }, 10);
            this.$router.push({ name: 'login' });
          })
          .catch((response) => {
            if (response?.errors) {
              if (typeof response === 'string') {
                this.$refs.validator.setErrors({ password: [response] });
              } else {
                const { password, password_confirmation, ...other } = response.errors;
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
                this.$refs.validator.setErrors(errors);
              }
            } else {
              this.$refs.validator.setErrors({ password: ['Unexpected error occured'] });
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
