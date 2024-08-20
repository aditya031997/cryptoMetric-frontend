<template>
  <validation-observer
    ref="validator"
    class="profile-forms"
  >
    <form
      class="mt-5"
      @submit.prevent="onSubmitForm"
    >
      <h2 class="m-0 pb-4 text text--title-3 profile-forms__title">Security</h2>
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
        class-wrapper="mt-3"
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
        Save
      </cm-button>
      <p
        v-if="responseMessage"
        class="mt-2 text text--caption text-success text-center"
      >
        {{ responseMessage }}
      </p>
      <p
        v-if="errorMessage"
        class="mt-2 text text--caption text-success text-center"
      >
        {{ errorMessage }}
      </p>
    </form>
    <div
      v-if="isLoad"
      class="profile-forms__loader"
    >
      <cm-loader />
    </div>
  </validation-observer>
</template>

<script>
import { ValidationObserver, ErrorMessage } from 'vee-validate';
import CmButton from '../ui/button/cm-button.vue';
import cmInput from '../ui/input/cm-input.vue';
import CmLoader from '../ui/loader/cm-loader.vue';
import IconShow from '../icons/icon-show-password.vue';
import IconHide from '../icons/icon-hide-password.vue';

export default {
  components: {
    cmInput,
    CmButton,
    ValidationObserver,
    ErrorMessage,
    CmLoader,
    IconShow,
    IconHide,
  },
  data: () => ({
    isLoad: false,
    passwordValue: '',
    isValid: true,
    passwordConfirmValue: '',
    passwordError: '',
    passwordConfirmError: '',
    passwordFieldType: 'password',
    passwordConfirmFieldType: 'password',
    responseMessage: '',
    errorMessage: '',
  }),
  watch: {
    isLoad() {
      this.$root.$emit('set-auth-loading', this.isLoad);
    },
    passwordValue() {
      this.errorMessage = '';
    },
    passwordConfirmValue() {
      this.errorMessage = '';
    },
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
    onSubmitForm() {
      if (
        !this.passwordError &&
        this.passwordValue &&
        this.passwordConfirmValue &&
        !this.passwordConfirmError
      ) {
        const data = {
          password: this.passwordValue,
          password_confirmation: this.passwordConfirmValue,
        };
        this.isLoad = true;
        this.$store
          .dispatch('updatePassword', data)
          .then((response) => {
            console.log(response, 'response');
            if (response) {
              this.responseMessage = response;
            } else {
              this.responseMessage = 'Password Updated';
            }
            this.passwordValue = '';
            this.passwordConfirmValue = '';
            this.isValid = true;
          })
          .catch((errors) => {
            console.log('Error: ', errors);
            if (typeof errors === 'string') {
              this.errorMessage = errors;
            } else if (errors?.errors) {
              this.errorMessage = errors.message;
            } else {
              this.errorMessage =
                'An error occurred while updating the password';
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
</style>
