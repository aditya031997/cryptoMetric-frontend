<template>
  <div>
    <div
      class="mt-4 d-flex align-items-center"
      v-for="(element, index) in listSettings"
      :key="element.id"
    >
      <cm-switch
        :id="element.id"
        :value="element.value"
        :index="index"
        @input="onChangeStatusAlert"
      >
        <span>Yes</span>
        <span>No</span>
      </cm-switch>
      <p class="m-0 ml-3 text">{{ element.text }}</p>
    </div>
    <div class="mt-4 d-flex align-items-center">
      <cm-switch
        id="email"
        :value="emailSwitch"
        @input="onChangeStatusEmail"
      >
        <span>Yes</span>
        <span>No</span>
      </cm-switch>
      <p class="m-0 ml-3 text">Send Alert by Email</p>
    </div>
  </div>
</template>

<script>
import CmSwitch from '../ui/switch/cm-switch.vue';
export default {
  components: { CmSwitch },
  data: () => ({
    listSettings: [
      {
        id: 0,
        text: 'Alert me about new coins',
        value: false,
      },
      {
        id: 1,
        text: 'Alert me about crypto coin price increasing',
        value: false,
      },
      {
        id: 2,
        text: 'Alert me about crypto coin price decreasing',
        value: false,
      },
    ],
    emailSwitch: false,
  }),
  methods: {
    onChangeStatusAlert(value, index) {
      this.listSettings[index].value = value;
      this.$store.dispatch('changeStatusAlertUser', {
        alert_type: this.listSettings[index].id,
        status: value,
      });
    },
    onChangeStatusEmail(value) {
      this.emailSwitch = value
      this.$store.dispatch('changeStatusAlertEmail', {
        status: value,
      });
    },
  },
  mounted() {
    this.listSettings[0].value = this.$store.state.user.data.is_new_coin_alert_enabled
    this.listSettings[1].value = this.$store.state.user.data.is_increase_alert_enabled
    this.listSettings[2].value = this.$store.state.user.data.is_decrease_alert_enabled
    this.emailSwitch = this.$store.state.user.data.email_alert_status
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
