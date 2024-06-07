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
                  <template v-if="item.check !== null">
                    <IconCheck v-if="item.check" class="check-icon" />
                    <IconClose v-else class="close-icon" />
                  </template>
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
import axios from 'axios';
import CmLoader from '@/components/ui/loader/cm-loader.vue';
import IconCheck from '../icons/icon-check.vue';
import IconClose from '../icons/icon-close.vue';
import SecurityData from './securityData.json';
import configs from '../../../configs/configs';

export default {
  name: 'coin-Security',
  components: {
    CmLoader,
    IconCheck,
    IconClose,
  },
  props: {
    slug: {
      type: String,
    },
    symbol: {
      type: String,
    },
  },
  data() {
    return {
      isLoad: false,
      securityList: [],
    };
  },
  methods: {
    async fetchSecurityData() {
      this.isLoad = true;
      try {
        // Initial API call to get token details
        const tokenResponse = await axios.get(`${configs.LOCAL_API_URL}/api/supply/tokenByName?query=${this.symbol}`);
        const tokenData = tokenResponse.data.msg;
        if (tokenData.length > 0) {
          const { address, chainId } = tokenData[0];

          const securityResponse = await axios.get(`${configs.LOCAL_API_URL}/api/supply/distribution?address=${address}&chainId=${chainId}`);
          const apiData = securityResponse.data.msg[address];
          const dynamicValues = {};

          if (apiData.is_open_source !== undefined)
            dynamicValues['Open Source'] =
              apiData.is_open_source === '1' ? 'Yes' : 'No';
          if (apiData.is_proxy !== undefined)
            dynamicValues['Proxy Contract'] =
              apiData.is_proxy === '1' ? 'Yes' : 'No';
          if (apiData.is_mintable !== undefined)
            dynamicValues['Mintable'] =
              apiData.is_mintable === '1' ? 'Yes' : 'No';
          if (apiData.owner_address !== undefined)
            dynamicValues['Owner Address'] =
              this.formatAddress(apiData.owner_address);
          if (apiData.can_take_back_ownership !== undefined)
            dynamicValues['Retrieve Ownership'] =
              apiData.can_take_back_ownership || 'No';
          if (apiData.balance_modifiable !== undefined)
            dynamicValues['Balance Mod'] = apiData.balance_modifiable || 'No';
          if (apiData.hidden_owner !== undefined)
            dynamicValues['Hidden Owner'] =
              apiData.hidden_owner === '1' ? 'Yes' : 'No';
          if (apiData.selfdestruct !== undefined)
            dynamicValues['Self Destruct'] =
              apiData.selfdestruct === '1' ? 'Yes' : 'No';
          if (apiData.external_call !== undefined)
            dynamicValues['External Call Risk'] =
              apiData.external_call === '1' ? 'Yes' : 'No';
          if (apiData.buy_tax !== undefined)
            dynamicValues['Buy Tax'] = (apiData.buy_tax || '0') + '%';
          if (apiData.sell_tax !== undefined)
            dynamicValues['Sell Tax'] = (apiData.sell_tax || '0') + '%';
          if (apiData.cannot_buy !== undefined)
            dynamicValues['Buy Available'] =
              apiData.cannot_buy === '0' ? 'Yes' : 'No';
          if (apiData.cannot_sell_all !== undefined)
            dynamicValues['Cannot Sell All'] =
              apiData.cannot_sell_all === '0' ? 'No' : 'Yes';
          if (apiData.slippage_modifiable !== undefined)
            dynamicValues['Slippage Mod'] = apiData.slippage_modifiable || 'No';
          if (apiData.honeypot_with_same_creator !== undefined)
            dynamicValues['Honeypot'] =
              apiData.honeypot_with_same_creator === '1' ? 'Yes' : 'No';
          if (apiData.transfer_pausable !== undefined)
            dynamicValues['Transfer Pausable'] =
              apiData.transfer_pausable || 'No';
          if (apiData.is_blacklisted !== undefined)
            dynamicValues['Blacklisted'] = apiData.is_blacklisted || 'No';
          if (apiData.is_whitelisted !== undefined)
            dynamicValues['Whitelisted'] = apiData.is_whitelisted || 'No';
          if (apiData.is_in_dex !== undefined)
            dynamicValues['In Dex'] = apiData.is_in_dex === '1' ? 'Yes' : 'No';
          if (apiData.is_anti_whale !== undefined)
            dynamicValues['Anti-Whale'] = apiData.is_anti_whale || 'No';
          if (apiData.anti_whale_modifiable !== undefined)
            dynamicValues['Anti-Whale Mod'] =
              apiData.anti_whale_modifiable || 'No';
          if (apiData.trading_cooldown !== undefined)
            dynamicValues['Trading Cooldown'] =
              apiData.trading_cooldown || 'No';
          if (apiData.token_name !== undefined)
            dynamicValues['Token Name'] = apiData.token_name;
          if (apiData.token_symbol !== undefined)
            dynamicValues['Token Symbol'] = apiData.token_symbol;
          if (apiData.holder_count !== undefined)
            dynamicValues['Holders'] = this.formatNumber(apiData.holder_count);
          if (apiData.total_supply !== undefined)
            dynamicValues['Total Supply'] = this.formatNumber(apiData.total_supply);
          if (apiData.owner_balance !== undefined)
            dynamicValues['Owner Balance'] = this.formatNumber(apiData.owner_balance || '0');
          if (apiData.owner_percent !== undefined)
            dynamicValues['Owner Percent'] =
              (apiData.owner_percent || '0') + '%';
          if (apiData.creator_address !== undefined)
            dynamicValues['Creator Address'] = this.formatAddress(apiData.creator_address);
          if (apiData.creator_balance !== undefined)
            dynamicValues['Creator Balance'] = this.formatNumber(apiData.creator_balance);
          if (apiData.creator_percent !== undefined)
            dynamicValues['Creator Percent'] =
              (apiData.creator_percent || '0') + '%';
          if (apiData.lp_holder_count !== undefined)
            dynamicValues['LP Holders'] = this.formatNumber(apiData.lp_holder_count);
          if (apiData.lp_total_supply !== undefined)
            dynamicValues['LP Total Supply'] = this.formatNumber(apiData.lp_total_supply);

          this.securityList = SecurityData
            .filter((item) => dynamicValues.hasOwnProperty(item.title))
            .map((item) => ({
              ...item,
              value: dynamicValues[item.title],
            }));
        } else {
          console.error('No token data found');
          this.$emit('error', 'No token data found');
        }
      } catch (error) {
        console.error('Failed to fetch security data:', error);
        this.$emit('error', 'Failed to fetch security data');
      } finally {
        this.isLoad = false;
      }
    },
    formatNumber(value) {
      if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
      if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
      if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
      return value.toString();
    },
    formatAddress(address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
  },
  mounted() {
    this.fetchSecurityData();
  },
};
</script>

<style lang="scss" scoped></style>
