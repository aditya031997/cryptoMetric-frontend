  <template>
    <tr>
      <td class="table-col">{{ id }}</td>
      <td class="table-col">
        <cm-link
          :custom-class="'d-flex align-items-center table__link table__link--alternative'"
          :to="getLink(id)"
          @click="navigateToLink(getLink(id))"
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
        v-if="typeof isAdmin !== 'undefined'"
        class="table-col"
        :class="{ 'text-blue': isAdmin }"
      >
        {{ isAdmin ? 'Admin' : '-' }}
      </td>
      <td class="table-col text-center">
        {{ Number(status) === 1 ? 'Yes' : 'No' }}
      </td>
      <td
        v-if="!isAdmin"
        class="text-center"
      >
        <button
          @click="onDeleteClick"
          class="remove-btn"
        >
          <icon-delete />
        </button>
      </td>
    </tr>
  </template>

  <script>
  import { format, parseISO } from 'date-fns';
  import CmLink from '../../ui/link/cm-link.vue';
  import { useRouter } from 'vue-router';
  import IconDelete from '../../icons/icon-delete.vue';

  export default {
    components: {
      CmLink,
      IconDelete,
    },
    props: {
      id: Number,
      firstName: String,
      lastName: String,
      email: String,
      isAdmin: Boolean,
      date: String,
      status: {
        type: [String, Number],
      },
    },
    setup() {
      const router = useRouter();
      const getLink = (id) => `/users/${id}`;
      const navigateToLink = (link) => {
        router.push(link).catch((error) => {
          console.error('Navigation error:', error);
        });
      };

      return {
        getLink,
        navigateToLink,
      };
    },
    methods: {
      onDeleteClick() {
        this.$emit('open-delete-modal', {
          id: this.id,
          firstName: this.firstName,
          lastName: this.lastName,
        });
      },
    },
    computed: {
      getDate() {
        return format(parseISO(this.date), 'MMM dd, yyyy');
      },
    },
  };
  </script>

  <style lang="scss" scoped>
  .remove-btn {
    background: transparent;
    border: none;
    padding: 0px;
  }
  </style>
