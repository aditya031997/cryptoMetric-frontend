<template>
  <tr class="">
    <td class="table-col">{{ id }}</td>
    <td class="table-col">
      <cm-link
        :custom-class="'d-flex align-items-center table__link table__link--alternative'"
        :to="getLink"
      >
        <span class="m-0 text">{{ firstName }} {{ lastName }}</span>
      </cm-link>
    </td>
    <td
      v-if="email"
      class="table-col table-col--email"
    >
      {{ email }}
    </td>
    <td
      v-if="date"
      class="table-col"
    >
      {{ getDate }}
    </td>
    <td
      class="table-col"
      v-if="typeof this.isAdmin !== 'undefined'"
      :class="{ 'text-blue': isAdmin }"
    >
      {{ isAdmin ? 'Admin' : '-' }}
    </td>
    <td class="d-sm-none d-xs-none"></td>
  </tr>
</template>

<script>
import { format, parseISO } from 'date-fns';
import CmLink from '../../ui/link/cm-link.vue';
export default {
  components: {
    CmLink,
  },
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
    isAdmin: {
      type: Boolean,
    },
    date: {
      type: String,
    },
  },
  computed: {
    getLink() {
      return `users/${this.id}`;
    },
    getDate() {
      return format(parseISO(this.date), 'MMM dd, yyyy');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
