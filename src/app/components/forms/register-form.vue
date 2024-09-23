<template>
  <div class="auth-form auth-form--create-user">
    <cm-logo />
    <h1 class="auth-form__title text text--title-2">Create Account</h1>
    <p class="auth-form__title text">Welcome to Cryptometric!</p>
    <div class="auth-form__wrapper">
      <validation-observer ref="validator">
        <form @submit.prevent="onSubmit">
          <cm-input
            class-wrapper="mt-3"
            id="input-first-name"
            label="First Name"
            v-model="firstNameValue"
            @input="firstNameValidation"
            :error="firstNameError"
            placeholder="Enter your first name"
          />
          <ErrorMessage name="first-name" />

          <cm-input
            class-wrapper="mt-3"
            id="input-last-name"
            label="Last Name"
            v-model="lastNameValue"
            @input="lastNameValidation"
            :error="lastNameError"
            placeholder="Enter your last name"
          />
          <ErrorMessage name="last-name" />

          <cm-input
            class-wrapper="mt-3"
            id="input-email"
            label="Email"
            v-model="emailValue"
            @input="emailValidation"
            @change="emailValidation"
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

          <cm-input
            class-wrapper="mt-3"
            id="input-confirm-password"
            label="Confirm Password"
            :type="passwordConfirmFieldType"
            v-model="passwordConfirmValue"
            @input="passwordConfirmValidation"
            :error="passwordConfirmError"
            placeholder="Confirm your password"
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
          <ErrorMessage name="passwordConfirm" />
          <cm-input
            class-wrapper="mt-3"
            id="input-invite-code"
            label="Invitation code"
            v-model="invitation_id"
            @input="invitationCodeValidation"
            :error="invideCodeError"
            placeholder="Enter your invitation code"
          />
          <ErrorMessage name="invite-code" />
          <cm-button
            custom-class="mt-4"
            :disabled="isValid"
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
import CmLogo from '../cm-logo.vue';
import CmLink from '../ui/link/cm-link.vue';
import accessToken from '../../utils/helpers/access-token';
import IconShow from '../icons/icon-show-password.vue';
import IconHide from '../icons/icon-hide-password.vue';

export default {
  components: {
    cmInput,
    CmButton,
    ValidationObserver,
    ErrorMessage,
    CmLogo,
    CmLink,
    IconShow,
    IconHide,
  },
  data: () => ({
    isLoad: false,
    firstNameValue: '',
    invitation_id: '',
    lastNameValue: '',
    emailValue: '',
    passwordValue: '',
    passwordConfirmValue: '',
    errorMessage: '',
    emailError: '',
    passwordError: '',
    firstNameError: '',
    invideCodeError: '',
    lastNameError: '',
    passwordConfirmError: '',
    isValid: true,
    passwordFieldType: 'password',
    passwordConfirmFieldType: 'password',
    hasTypedInConfirmPassword: false,
  }),
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    togglePasswordConfirmVisibility() {
      this.passwordConfirmFieldType =
        this.passwordConfirmFieldType === 'password' ? 'text' : 'password';
    },
    emailValidation(event) {
      if (event !== '') {
        this.emailValue = event;
      }
      if (event === '') {
        this.emailError = 'The email field is required';
        return;
      }
      const regex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[a-zA-Z0-9]*$/;
      if (!regex.test(event)) {
        this.emailError = 'The email field must be a valid email';
      } else {
        this.emailError = '';
      }
      this.validation();
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
      if (this.hasTypedInConfirmPassword) {
        this.passwordConfirmValidation(this.passwordConfirmValue);
      }
      this.validation();
    },
    firstNameValidation(event) {
      if (event !== '') {
        this.firstNameValue = event;
      }
      if (event === '') {
        this.firstNameError = 'The first name field is required';
        return;
      }
      this.firstNameError = '';
      this.validation();
    },
    invitationCodeValidation(event) {
      if (event !== '') {
        this.invitation_id = event;
      }
      if (event === '') {
        this.invideCodeError = 'The invitation code field is required';
        return;
      }
      this.invideCodeError = '';
      this.validation();
    },
    lastNameValidation(event) {
      if (event !== '') {
        this.lastNameValue = event;
      }
      if (event === '') {
        this.lastNameError = 'The last name field is required';
        return;
      }
      this.lastNameError = '';
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
        !this.emailError &&
        !this.lastNameError &&
        !this.firstNameError &&
        !this.passwordConfirmError &&
        this.passwordValue &&
        this.emailValue &&
        this.firstNameValue &&
        this.lastNameValue &&
        this.passwordConfirmValue
      ) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    onSubmit() {
      if (
        !this.firstNameError &&
        !this.lastNameError &&
        !this.emailError &&
        !this.passwordError &&
        !this.passwordConfirmError &&
        this.firstNameValue &&
        this.lastNameValue &&
        this.emailValue &&
        this.passwordValue &&
        this.passwordConfirmValue
      ) {
        const data = {
          name: `${this.firstNameValue} ${this.lastNameValue}`,
          email: this.emailValue,
          password: this.passwordValue,
          password_confirmation: this.passwordConfirmValue,
          invitation_id: this.invitation_id,
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
  mounted() {
    const emailFromUrl = this.$route.query.email;
    const tokenFromUrl = this.$route.query.token;

    if (emailFromUrl) {
      this.emailValue = decodeURIComponent(emailFromUrl);
      this.emailValidation(this.emailValue);
    }

    if (tokenFromUrl) {
      this.invitation_id = tokenFromUrl;
      this.invitationCodeValidation(this.invitation_id);
    }
  },
};
</script>


<style lang="scss" scoped>
.cm-input__wrapper {
  position: relative;
}

.cm-input__append {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

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
