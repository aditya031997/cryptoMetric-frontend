<template>
  <cm-card
    is-header-none
    custom-class="page-profile__card mt-4"
  >
    <personal-info :email="getEmailUser" />
    <update-password />
  </cm-card>
</template>

<script>
import { mapGetters } from 'vuex';
import UpdatePassword from '../components/forms/update-password.vue';
import PersonalInfo from '../components/forms/personal-info.vue';
import CmCard from '../components/ui/card/cm-card.vue';

export default {
  components: {
    CmCard,
    PersonalInfo,
    UpdatePassword,
  },
  data: () => ({
    isLoad: false,
  }),
  computed: {
    ...mapGetters(['getEmailUser']),
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
