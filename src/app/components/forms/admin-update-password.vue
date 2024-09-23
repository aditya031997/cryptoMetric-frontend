<template>
  <div class="mt-4 profile-forms profile-forms--admin">
    <div class="d-flex align-items-center">
      <icon-security class="text-secondary flex-shrink-1" />
      <h2 class="m-0 ml-2 text text--subtitile-1">Update user’s password</h2>
    </div>
    <validation-observer ref="validator">
      <form @submit.prevent="submitForm">
        <cm-input
          class-wrapper="mt-3"
          id="input-password"
          label="Password"
          :type="passwordFieldType"
          v-model="passwordValue"
          :error="passwordError"
          @input="passwordValidation"
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
          Update
        </cm-button>
        <p
          v-if="responseMessage"
          class="mt-2 text text--caption text-success text-center"
        >
          {{ responseMessage }}
        </p>
        <p
          v-if="errorMessage"
          class="mt-2 text text--caption text-danger text-center"
        >
          {{ errorMessage }}
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
import { ValidationObserver, ErrorMessage } from 'vee-validate';
import iconSecurity from '../icons/icon-security.vue';
import CmButton from '../ui/button/cm-button.vue';
import CmInput from '../ui/input/cm-input.vue';
import CmLoader from '../ui/loader/cm-loader.vue';
import IconShow from '../icons/icon-show-password.vue';
import IconHide from '../icons/icon-hide-password.vue';
import { validatePassword } from '../../utils/helpers/validate-password';
export default {
  components: {
    iconSecurity,
    CmInput,
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
    hasTypedInConfirmPassword: false,
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
    submitForm() {
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
          .dispatch('adminUpdatePassword', {
            id: this.$route.params.user,
            passwords: data,
          })
          .then((response) => {
            // Handle response message
            if (response) {
              this.responseMessage = response;
            } else {
              this.responseMessage = 'Password Updated';
            }

            // Reset password fields
            this.passwordValue = '';
            this.passwordConfirmValue = '';
            this.isValid = true;
          })
          .catch((errors) => {
            console.log('Error: ', errors);
            if (errors) {
              this.errorMessage = errors?.response?.data?.message;
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
    onChangePassword(value) {
      this.responseMessage = '';
      this.passwordValue = value;
    },
    onChangePasswordConfirm(value) {
      this.responseMessage = '';
      this.passwordConfirmValue = value;
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
