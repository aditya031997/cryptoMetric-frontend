<template>
  <page-card
    ref="page"
    class="page-news"
    :is-load="isLoad"
    is-default
    :customClass="'mt-4'"
    :text-close-content="'List is empty'"
    :is-close-content="!getNewsList.length"
  >
    <template v-slot:nav>
      <cm-input
        is-icons
        secondary
        @input="changeSearchValue"
        :value="search"
        :placeholder="'Search News ...'"
        :class-wrapper="'page-news__input mr-2'"
      >
        <icon-search />
      </cm-input>
      <div class="d-flex align-items-center page-news__options">
        <p class="m-0 mr-2 text text-grey page-news__options-text">Send me news updates by email:</p>
        <cm-select
          is-icons
          is-primary
          :class-wrapper="'page-news__select'"
          :placeholder="'Select'"
          :options="statusOptions"
          :value="valueSelect"
          :on-change="onOpenModal"
        >
          <icon-sms />
        </cm-select>
        <cm-modal
          :is-active="isModal"
          :class="'change-news__modal'"
          :on-close="onCloseModal"
          :title="'Are you going to change News updates?'"
        >
          <modal-accept
            :on-click-no="onCloseModal"
            :on-click-yes="changeEmailStatus"
          />
        </cm-modal>
      </div>
    </template>
    <ul class="p-0 row row-cols-xl-2 row-cols-lg-1 page-news__list">
      <li
        class="page-news__list-element"
        v-for="news in getNewsList"
        :key="news.id"
      >
        <news-card
          :date-created="news.created_at"
          :description="news.description"
          :image="news.image"
          :resource="news.resource"
          :title="news.title"
          :url="news.url"
        />
      </li>
    </ul>
    <template v-slot:footer>
      <cm-pagination
        :current-page="getCurrentPage"
        :total="getTotalPage"
        :links="formatterPagination(getCurrentPage, getTotalPage)"
        :value-pagination="itemsValue"
        :options-pagination="itemsPagination"
        :go-to-page="changePage"
        :change-item-value="changeItemValue"
        label-pagination="Show items:"
      />
    </template>
  </page-card>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import CmPagination from '../components/cm-pagination.vue';
import IconSearch from '../components/icons/icon-search.vue';
import IconSms from '../components/icons/icon-sms.vue';
import PageCard from '../components/ui/card/page-card.vue';
import CmInput from '../components/ui/input/cm-input.vue';
import CmSelect from '../components/ui/select/cm-select.vue';
import NewsCard from '../components/news-card.vue';
import CmModal from '../components/ui/modal/cm-modal.vue';
import ModalAccept from '../components/modals/modal-accept.vue';
import ModalMixin from '@/utils/mixins/modal';
import { getListenerEcho, stopListenerEcho } from '../utils/echo';
import { pagination } from '../utils/helpers/pagination-create';
export default {
  mixins: [ModalMixin],
  components: {
    CmPagination,
    CmInput,
    CmSelect,
    PageCard,
    IconSearch,
    IconSms,
    NewsCard,
    CmModal,
    ModalAccept,
  },
  name: 'dashboard-news',
  data: () => ({
    isModal: false,
    isLoad: false,
    search: '',
    valueSelect: { id: 1, name: 'Daily' },
    valueSelectSaved: null,
    itemsValue: 8,
    itemsPagination: [4, 6, 8, 10, 12],
    statusOptions: [
      { id: 0, name: 'Disabled' },
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Weekly' },
    ],
    getNewsDebounced: null,
  }),
  computed: {
    ...mapGetters(['getNewsList', 'getCurrentPage', 'getTotalPage', 'getLinksNews', 'getUserEmailStatus']),
  },
  methods: {
    getNews(page, search, items, isGetStatus) {
      this.isLoad = true;
      this.$store
        .dispatch('getNews', {
          page: page || this.$route.query.page,
          search: search || this.$route.query.search,
          pagination: items || this.$route.query.items,
        })
        .then((value) => {
          document.body.scrollIntoView(true);
        })
        .finally(() => {
          this.isLoad = false;
          if (isGetStatus) {
            const status = this.statusOptions.find(
              (status) => status.id === this.$store.state.user.data?.email_news_notification_level
            );
            if (status) {
              this.valueSelect = status;
            }
          }
        });
    },
    changePage(page) {
      this.isLoad = true;
      this.$router.replace({ query: { ...this.$route.query, page } });
      this.getNews();
    },
    changeItemValue(items) {
      if (items) {
        this.itemsValue = items;
      } else {
        this.itemsValue = this.itemsPagination[0];
      }
      if (Number(this.$route.query.items) !== this.itemsValue) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: 1,
            items: this.itemsValue,
          },
        });
      }
      this.getNews();
    },
    changeSearchValue(value) {
      const searchValue = value.trim();
      if (searchValue) {
        this.search = searchValue;
        this.$router.replace({
          query: {
            ...this.$route.query,
            search: searchValue,
          },
        });
      } else {
        this.search = '';
        this.$router.replace({
          query: {
            ...this.$route.query,
            search: undefined,
          },
        });
      }
      this.getNewsDebounced();
    },
    onOpenModal(value) {
      if (value && this.valueSelect !== value) {
        this.valueSelectSaved = value;
        this.isModal = true;
         document.body.classList.add('modal-open');
      }
    },
    onCloseModal() {
      this.isModal = false;
      document.body.classList.remove('modal-open');
    },
    changeEmailStatus() {
      this.isModal = false;
      this.valueSelect = this.valueSelectSaved;
      const indexStatus = this.statusOptions.findIndex((option) => option === this.valueSelect);
      if (indexStatus !== -1) {
        this.$store.dispatch('changeEmailStatus', {
          name: this.valueSelect,
          status: indexStatus,
        });
      }
    },
    formatterPagination(currentPage, maxPages) {
      return pagination(currentPage, maxPages);
    },
  },
  mounted() {
    this.getNewsDebounced = _.debounce(this.getNews, 300);
    if (this.$route.query.search) {
      this.search = this.$route.query.search;
    }
    if (this.$route.query.items) {
      this.itemsValue = Number(this.$route.query.items);
      if (!this.itemsPagination.find((item) => item === Number(this.$route.query.items))) {
        this.itemsValue = Number(this.itemsPagination[0]);
        this.$router.replace({
          query: {
            ...this.$route.query,
            items: this.itemsValue,
          },
        });
      }
    }
    this.getNews(null, null, null, true);
    getListenerEcho('NewsUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getNews').finally(() => {
        this.isLoad = false;
      });
    });
  },
  beforeDestroy() {
    stopListenerEcho('NewsUpdated');
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
