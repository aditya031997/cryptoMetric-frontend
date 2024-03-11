<template>
  <page-card
    :custom-class="'mt-4'"
    :is-load="isLoad"
    is-none-header
  >
    <user-info
      v-if="!errorMessage"
      :date="user.created_at"
      :email="user.email"
      :firs-name="user.firstname"
      :last-name="user.lastname"
      :id="user.id"
      :is-admin="user.is_admin"
    />
    <admin-update-password v-if="!errorMessage" />
    <p class="text text-center h-100 d-flex align-items-center justify-content-center text-danger text--caption">
      {{ errorMessage }}
    </p>
  </page-card>
</template>

<script>
import PageCard from '../components/ui/card/page-card.vue';
import UserInfo from '../components/user-info.vue';
import AdminUpdatePassword from '../components/forms/admin-update-password.vue';
export default {
  components: {
    PageCard,
    UserInfo,
    AdminUpdatePassword,
  },
  data: () => ({
    isLoad: false,
    user: {},
    errorMessage: '',
  }),
  mounted() {
    this.isLoad = true;
    this.$store
      .dispatch('getAdminUser', this.$route.params.user)
      .then((value) => {
        this.user = value;
      })
      .catch(() => {
        this.errorMessage = `User "${this.$route.params.user}" not found, please try again later`;
      })
      .finally(() => {
        this.isLoad = false;
      });
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
