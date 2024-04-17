<template>
  <div class="mt-4 profile-forms profile-forms--admin">
    <div class="d-flex align-items-center">
      <icon-security class="text-secondary flex-shrink-1" />
      <h2 class="m-0 ml-2 text text--subtitile-1">Update user’s password</h2>
    </div>
    <validation-observer
      ref="validator"
    >
      <form @submit.prevent="submitForm">
        <!-- <validation-provider
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
            :value="password"
            @input="onChangePassword"
          />
          <ErrorMessage name="password"/>
        <!-- </validation-provider> -->
        <!-- <validation-provider
          name="confirm password"
          vid="password_confirmation"
          rules="required|confirmed:password"
          v-slot="{ errors }"
        > -->
          <cm-input
            class-wrapper="mt-4"
            id="input-confirm-password"
            label="Confirm Password"
            type="password"
            :value="passwordConfirm"
            @input="onChangePasswordConfirm"
          />
          <ErrorMessage name="confirm password"/>
        <!-- </validation-provider> -->
        <cm-button
          :disabled="!!message || invalid"
          type="submit"
          is-block
          custom-class="mt-4"
        >
          Update
        </cm-button>
        <p
          class="mt-2 text text--caption text-success text-center"
          v-if="message"
        >
          {{ message }}
        </p>
        <p
          class="mt-2 text text--caption text-success text-center"
          v-if="error"
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
import { ValidationObserver,ErrorMessage } from 'vee-validate';
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
    passwordConfirm: '',
    message: '',
    error: '',
  }),
  methods: {
    submitForm() {
      this.message = '';
      if (validatePassword(this.password)) {
        this.error = "Password must have digits, uppercase, lowercase and non-alphanumeric symbols"
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
