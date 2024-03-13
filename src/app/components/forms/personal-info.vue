<template>
  <validation-observer
    ref="validator"
    class="profile-forms"
    v-slot="{ handleSubmit, invalid }"
  >
    <form @submit.prevent="handleSubmit(onSubmitForm)">
      <h2 class="m-0 pb-4 text text--title-3 profile-forms__title">Personal Info</h2>
      <validation-provider
        name="email"
        rules="required"
        v-slot="{ errors }"
      >
        <cm-input
          id="first_name"
          label="First Name"
          class-wrapper="mt-4"
          :is-error="!!firstName"
          :error="errors[0]"
          v-model="firstName"
        />
      </validation-provider>
      <validation-provider
        name="email"
        rules="required"
        v-slot="{ errors }"
      >
        <cm-input
          id="last_name"
          label="Last Name"
          :class-wrapper="'mt-4'"
          :is-error="!!lastName"
          :error="errors[0]"
          v-model="lastName"
        />
      </validation-provider>
      <cm-input
        label="Email"
        class-wrapper="mt-4"
        :placeholder="email"
        secondary
        disabled
      />
      <cm-button
        :disabled="isNotValidate"
        type="submit"
        is-block
        :custom-class="'mt-4'"
      >
        Save
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
    <div
      v-if="isLoad"
      class="profile-forms__loader"
    >
      <cm-loader />
    </div>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import CmButton from '../ui/button/cm-button.vue';
import cmInput from '../ui/input/cm-input.vue';
import CmLoader from '../ui/loader/cm-loader.vue';
export default {
  components: {
    cmInput,
    CmButton,
    ValidationObserver,
    ValidationProvider,
    CmLoader,
  },
  props: {
    email: {
      type: String,
    },
  },

  data: () => ({
    isLoad: false,
    firstName: '',
    lastName: '',
    message: '',
    error: '',
  }),
  computed: {
    isNotValidate() {
      if (this.firstName === '' || this.lastName === '') {
        return true;
      }
      return (
        this.$store.state.user.data.firstname === this.firstName &&
        this.$store.state.user.data.lastname === this.lastName
      );
    },
  },
  watch: {
    firstName() {
      this.error = '';
    },
    lastName() {
      this.error = '';
    },
  },
  methods: {
    onSubmitForm() {
      this.isLoad = true;
      this.$store
        .dispatch('changeUserInfo', {
          first_name: this.firstName,
          last_name: this.lastName,
        })
        .then((value) => {
          this.message = 'Profile updated';
        })
        .catch((errors) => {
          if (typeof errors === 'string') {
            this.error = errors;
          } else {
            if (errors?.errors) {
              this.$refs.validator.setErrors({ ...errors.errors });
            } else {
              this.$refs.validator.setErrors({ email: ['Unexpected error occured'] });
            }
          }
        })
        .finally(() => (this.isLoad = false));
    },
  },
  mounted() {
    this.firstName = this.$store.state.user.data.firstname;
    this.lastName = this.$store.state.user.data.lastname;
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
