<template>
  <div ref="coin-security" v-if="!isLoad">
    <div class="security-list">
      <ul id="v-for-security" class="demo">
        <li v-for="(item, index) in securityList" :key="index">
          <div class="security-field">
            <div class="sec-title-value">
              <h4 class="sub-title">{{ item.title }}</h4>
              <p class="style-paragraph">{{ item.description }}</p>
            </div>
            <div class="sec-check-value">
              <span class="caption">
                <div class="sec-value-field">
                  <span>{{ item.value }}</span>
                  <IconCheck v-if="item.check" class="check-icon" />
                  <IconClose v-else class="close-icon" />
                </div>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="loader-wrapper" v-else>
    <cm-loader />
  </div>
</template>
<script>
import CmLoader from '@/components/ui/loader/cm-loader.vue';
import { getListenerEcho, stopListenerEcho } from '../../utils/echo';
import IconCheck from '../icons/icon-check.vue';
import IconClose from '../icons/icon-close.vue';
import SecurityData from './securityData.json';
console.log(SecurityData, 'datalist');
export default {
  name: 'coin-Security',
  components: {
    CmLoader,
    IconCheck,
    IconClose,
    SecurityData,
  },
  props: {
    slug: {
      type: String,
    },
  },
  data() {
    return {
      isLoad: false,
      securityList: SecurityData
    };
  },
  methods: {
    fetchSecurityData() {
      this.isLoad = true;
      this.$api
        .get('./securityData.json')
        .then((response) => {
          console.log('Data fetched:', response.data);
          this.securityList = response.data.security_features;
        })
        .catch((error) => {
          console.error('Failed to fetch security data:', error);
          this.$emit('error', 'Failed to fetch security data');
        })
        .finally(() => {
          this.isLoad = false;
        });
    },
  },
  mounted() {
    this.fetchSecurityData();
  },
};
</script>

<style lang="scss" scoped></style>
