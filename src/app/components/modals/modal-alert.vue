<template>
  <validation-observer
    ref="validator"
    v-if="!isLoad"
  >
    <form
      class="modal-alert"
      @submit.prevent="onSubmit"
    >
      <search-select
        class-wrapper="mt-4"
        label="Coin name"
        :options="getCoinsNames"
        :on-change="onChangeName"
        placeholder="Search coin name..."
        :value="name"
        :index="1"
        is-big-select
        is-full
      />

      <cm-select
        class-wrapper="mt-4"
        label="Price Currency"
        placeholder="Currency"
        :options="optionsCurrency"
        :on-change="onChangeCurrency"
        :index="2"
        is-big-select
        is-full
        :value="currency"
      />

      <cm-input
        class-wrapper="mt-4"
        label="Price Value"
        v-model="priceValue"
        @input="priceValidation"
        :error="priceError"
      />
      <p class="m-0 mt-4 mr-1 text text--caption">Alert Action:</p>
      <div class="mt-1 d-flex align-items-center">
        <cm-switch
          v-model="actionSwitch"
          id="switch-action"
          custom-class="modal-alert__switch"
        >
          <icon-percent-up class="text-danger" />
          <icon-percent-down class="text-success" />
        </cm-switch>
        <p
          class="m-0 ml-2 text text--caption text-success user-select-none"
          :class="{ 'text-danger': actionSwitch }"
        >
          {{ actionSwitch ? 'Decrease' : 'Increase' }}
        </p>
      </div>
      <cm-button
        custom-class="mt-4"
        is-block
        type="submit"
        :disabled="isValid"
      >
        Create Alert
      </cm-button>
      <p
        v-if="errorMessage"
        class="mt-2 text text-center text-danger"
      >
        {{ errorMessage }}
      </p>
    </form>
  </validation-observer>
  <div
    v-else
    class="loader-wrapper"
  >
    <cm-loader />
  </div>
</template>

<script>
import CmButton from '../ui/button/cm-button.vue';
import cmInput from '../ui/input/cm-input.vue';
import CmSelect from '../ui/select/cm-select.vue';
import { ValidationObserver } from 'vee-validate';
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import { mapGetters } from 'vuex';
import CmLoader from '../ui/loader/cm-loader.vue';
import SearchSelect from '../ui/select/search-select.vue';
import CmSwitch from '../ui/switch/cm-switch.vue';
import IconPercentUp from '../icons/icon-percent-down.vue';
import IconPercentDown from '../icons/icon-percent-up.vue';
export default {
  name: 'modal-alert',
  components: {
    cmInput,
    CmButton,
    CmSelect,
    ValidationObserver,
    CmLoader,
    SearchSelect,
    CmSwitch,
    IconPercentUp,
    IconPercentDown,
  },
  props: {
    onCloseModal: {
      type: Function,
    },
  },
  data: () => ({
    actionSwitch: false,
    isLoad: false,
    optionsCurrency: ['USD', 'BTC'],
    options: [1, 2, 3, 4, 5, 6],
    name: null,
    currency: null,
    priceValue: '',
    isValid: true,
    priceError: '',
    decimal: '',
    errorMessage: '',
  }),
  watch: {
    actionSwitch() {
      this.errorMessage = '';
    },
    name() {
      this.errorMessage = '';
    },
    currency() {
      this.errorMessage = '';
    },
    decimal() {
      this.errorMessage = '';
    },
    passwordValue() {
      this.errorMessage = '';
    },
  },
  computed: {
    ...mapGetters(['getCoinsNames']),
  },
  methods: {
    priceValidation(event) {
      this.priceValue = event;

      if (event === '') {
        this.priceError = 'The price field is required';
      } else if (!/^\d*\.?\d+$/.test(event)) {
        this.priceError = 'The price field must be a valid decimal';
      } else {
        this.priceError = '';
      }

      this.validation();
    },
    validation() {
      if (!this.priceError && this.priceValue) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    },
    onChangeName(value) {
      this.name = value;
    },
    onChangeCurrency(value) {
      this.currency = value;
    },
    onSubmit() {
      const decimalFloatLength = this.priceValue.toString().includes('.')
        ? this.priceValue.toString().split('.').pop().length
        : 0;
      if (Number(this.priceValue) <= 0) {
        // this.$refs.validator.setErrors({
        //   price: ['Number cannot be negative or equal to zero'],
        // })
        this.priceError = "Number cannot be negative or equal to zero"
        return;
      }
      if (decimalFloatLength <= 12) {
        this.isLoad = true;
        this.$store
          .dispatch('postCreateAlert', {
            coin: this.name,
            data: {
              coin_id: this.name.coin_id,
              price_currency: this.currency === 'USD' ? 0 : 1,
              price: this.priceValue,
              alert_type: !this.actionSwitch ? 1 : 2,
            },
          })
          .then(() => {
            this.onCloseModal();
          })
          .catch((error) => {
            this.errorMessage = error;
          })
          .finally(() => (this.isLoad = false));
      } else {
        this.$refs.validator.setErrors({
          price: [
            'The number of characters after the decimal point exceeds the limit. Max - 12',
          ],
        });
      }
    },
  },
  mounted() {
    if (this.$store.state.coins.names.length === 0) {
      this.isLoad = true;
      this.$store
        .dispatch('getCoinsNames')
        .then((response) => {
        })
        .catch((error) => {
          console.error('API Error:', error);
        })
        .finally(() => {
          this.isLoad = false;
        });
    }
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
