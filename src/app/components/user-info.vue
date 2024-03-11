<template>
  <div class="user-info">
    <h1 class="m-0 text text--title-2 user-info__title">{{ firstName }} {{ lastName }}</h1>
    <ul class="user-info__list">
      <li class="user-info__element">
        <p class="m-0 text text-grey text--caption">ID</p>
        <p class="m-0 mt-2 text">{{ id }}</p>
      </li>
      <li class="user-info__element">
        <p class="m-0 text text-grey text--caption">Email</p>
        <p class="m-0 mt-2 text">{{ email }}</p>
      </li>
      <li class="user-info__element">
        <p class="m-0 text text-grey text--caption">Registration date</p>
        <p class="m-0 mt-2 text">{{ getDate }}</p>
      </li>
      <li class="user-info__element">
        <p class="m-0 text text-grey text--caption">Role</p>
        <p class="m-0 mt-2 text">{{ getRole }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { parseISO, format } from 'date-fns';
export default {
  props: {
    id: {
      type: Number,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    date: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
    },
  },
  computed: {
    getDate() {
      if (this.date) {
        return format(parseISO(this.date), 'MMM dd, yyyy');
      }
      return '';
    },
    getRole() {
      return this.isAdmin ? 'Admin' : '-';
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
