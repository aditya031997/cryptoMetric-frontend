<template>
  <ul class="alert-list" ref="alerts">
    <cm-link
      v-for="alert in alerts"
      :key="alert.id"
      :custom-class="'alert-list__element-link'"
      :to="getLink(alert.coin_slug || alert.data.coin_slug)"
      @click="navigateToLink(getLink(alert.coin_slug || alert.data.coin_slug))"
    >
      <alert-card
        v-if="alert.data.alert_type === 1 || alert.data.alert_type === 2"
        :name="alert.coin_name"
        :symbol="alert.coin_symbol"
        :is-percent-down="alert.data.alert_type === 2"
        :percent="alert.data.delta"
        :action="alert.data.alert_type"
        :price="alert.data.price"
        :date="alert.created_at"
        :currency="alert.data.price_currency"
        :is-card-line="isAlertsPage"
      />
      <alert-new-coin
        v-else
        :name="alert.data.coin_name"
        :symbol="alert.data.coin_symbol"
        :slug="alert.data.coin_slug"
        :date="alert.created_at"
      />
    </cm-link>
  </ul>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import AlertNewCoin from './alert-new-coin.vue'
import AlertCard from './alert-card.vue'
import CmLink from '../ui/link/cm-link.vue'

export default {
  name: 'widget-alert-list',
  components: {
    AlertNewCoin,
    AlertCard,
    CmLink,
  },
  props: {
    alerts: {
      type: Array,
    },
    isAlertsPage: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const getLink = (slug) => {
      console.log('Slug:', slug)
      return `/crypto-markets/${slug}`
    }

    const navigateToLink = (link) => {
      console.log('Navigating to:', link)
      router.push(link)
        .then(() => {
          console.log('Navigation successful')
        })
        .catch((error) => {
          console.error('Navigation error:', error)
        })
    }

    return {
      getLink,
      navigateToLink,
    }
  },
}
</script>

<style lang="scss" scoped></style>