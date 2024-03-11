<template>
  <div
    class="tradingview-chart"
    :id="containerId"
    :class="[size, theme]"
  />
</template>

<script>
import '@/plugins/tradingview/tv.min.js';
import { widget } from '@/plugins/tradingview/charting_library/charting_library';
import { logMessage } from '@/plugins/tradingview/datafeeds/udf/lib/helpers';
import {
  QuotesProvider,
  Requester,
  UDFCompatibleDatafeedBase,
} from '@/plugins/tradingview/datafeeds/udf/dist/bundle';
import { format } from 'date-fns';
import UserThemeMixin from '@/utils/mixins/user-theme';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

let apiClient = null;
let isWidgetExists = false;

Requester.prototype.sendRequest = function (datafeedUrl, urlPath, params) {
  if (!isWidgetExists && urlPath !== 'config') {
    return new Promise((resolve, reject) => {
      reject();
    });
  }
  if (urlPath === 'symbol_info') {
    urlPath = 'symbol-info';
  }
  if (params !== undefined) {
    var paramKeys = Object.keys(params);
    if (paramKeys.length !== 0) {
      urlPath += '?';
    }
    urlPath += paramKeys
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key].toString());
      })
      .join('&');
  }
  logMessage('New request: ' + urlPath);
  if (apiClient) {
    return apiClient.get(`${datafeedUrl}/${urlPath}`);
  } else {
    // Send user cookies if the URL is on the same origin as the calling script.
    var options = { credentials: 'same-origin' };
    if (this._headers !== undefined) {
      options.headers = this._headers;
    }

    return fetch(`${datafeedUrl}/${urlPath}`, options)
      .then((response) => response.text())
      .then((responseTest) => JSON.parse(responseTest));
  }
};

class Datafeed extends UDFCompatibleDatafeedBase {
  constructor(datafeedURL, updateFrequency = 10 * 1000) {
    const requester = new Requester();
    const quotesProvider = new QuotesProvider(datafeedURL, requester);
    super(datafeedURL, quotesProvider, requester, updateFrequency);
  }
}

const defaultWidgetOptions = {
  locale: getLanguageFromURL() || 'en',
  disabled_features: [
    'use_localstorage_for_settings',
    'go_to_date',
    'symbol_info',
    'context_menus',
    'edit_buttons_in_legend',
    'compare_symbol',
    'header_saveload',
    'display_market_status',
    'remove_library_container_border',
    'property_pages',
    'show_chart_property_page',
    'chart_property_page_background',
    'source_selection_markers',
    'header_symbol_search',
    'header_compare',
    'header_undo_redo',
    'header_screenshot',
    'header_fullscreen_button',
  ],
  timeframe: '12M',
  has_intraday: true,
  save_image: false,
  hide_side_toolbar: false,
  time_frames: [
    {
      title: '1D',
      text: '1D',
      resolution: '1',
      description: '1 Day',
    },
    {
      title: '5D',
      text: '5D',
      resolution: '5',
      description: '5 Days',
    },
    {
      title: '1M',
      text: '1M',
      resolution: '30',
      description: '1 Month',
    },
    {
      title: '3M',
      text: '3M',
      resolution: '60',
      description: '3 Month',
    },
    {
      title: '6M',
      text: '6M',
      resolution: '120',
      description: '6 Month',
    },
    {
      title: '1Y',
      text: '1Y',
      resolution: 'D',
      description: '1 Year',
    },
    {
      title: '5Y',
      text: '5Y',
      resolution: 'W',
      description: '5 Years',
    },
    {
      text: '10Y',
      resolution: 'M',
      description: 'All',
      title: 'All',
    },
  ],
  overrides: {
    'mainSeriesProperties.candleStyle.upColor': '#26A69A',
    'mainSeriesProperties.candleStyle.downColor': '#EF5350',
    'mainSeriesProperties.candleStyle.drawWick': true,
    'mainSeriesProperties.candleStyle.drawBorder': true,
    'mainSeriesProperties.candleStyle.borderColor': '#26A69A',
    'mainSeriesProperties.candleStyle.borderUpColor': '#26A69A',
    'mainSeriesProperties.candleStyle.borderDownColor': '#EF5350',

    'mainSeriesProperties.areaStyle.color1': '#F4FAFF',
    'mainSeriesProperties.areaStyle.color2': '#F4FAFF',
    'mainSeriesProperties.areaStyle.linecolor': '#2196F3',
    'mainSeriesProperties.areaStyle.linewidth': 3,
  },
  customFormatters: {
    dateFormatter: {
      format: (date) => {
        return format(date, 'dd MMM yyyy');
      },
    },
  },
  custom_css_url: 'chart-custom.css',
};

const simpleOptions = {
  range: '12m',
  timezone: 'Etc/UTC',
  toolbar_bg: '#f1f3f6',
  enable_publishing: false,
  hide_side_toolbar: true,
  hide_top_toolbar: true,
  hide_legend: true,
};

export default {
  name: 'chart-trading-view',
  mixins: [UserThemeMixin],
  data: () => ({
    tvWidget: null,
    platformName: null,
    initTimeout: null,
  }),
  props: {
    autoInit: {
      default: false,
      type: Boolean,
    },
    autoInitSimple: {
      default: false,
      type: Boolean,
    },
    symbol: {
      default: 'BTC',
      type: String,
    },
    interval: {
      default: 'D',
      type: String,
    },
    containerId: {
      default: 'tv_chart_container',
      type: String,
    },
    datafeedUrl: {
      default: '/tradingview-chart',
      type: String,
    },
    libraryPath: {
      default: '/plugins/tradingview/charting_library/',
      type: String,
    },
    chartsStorageUrl: {
      default: 'https://saveload.tradingview.com',
      type: String,
    },
    chartsStorageApiVersion: {
      default: '1.1',
      type: String,
    },
    clientId: {
      default: 'tradingview.com',
      type: String,
    },
    userId: {
      default: 'public_user_id',
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    },
    styleArea: {
      default: false,
      type: Boolean,
    },
    size: {
      default: 'tradingview-chart-md',
      type: String,
    },
    /**
     * @TODO hide_side_toolbar for prod, show on dev - default: true for dev
     */
    topToolbar: {
      default: true,
      type: Boolean,
    },
    slug: {
      default: 'bitcoin',
      type: String,
    },
  },
  beforeMount() {},
  mounted() {
    apiClient = this.$api;

    this.$nextTick(() => {
      if (this.autoInit) {
        this.initWidget();
      } else if (this.autoInitSimple) {
        this.initSimpleWidget();
      }
    });
  },
  beforeDestroy() {
    clearTimeout(this.initTimeout);
    this.initTimeout = null;
    this.removeWidget();
  },
  watch: {
    symbol() {
      this.initWidget();
    },
    styleArea() {
      this.initWidget();
    },
    topToolbar() {
      this.initWidget();
    },
    themeId() {
      this.initWidget();
    },
  },
  methods: {
    getWidgetOptions(isSimple = false) {
      let options = { ...defaultWidgetOptions };

      if (isSimple) {
        options = { ...options, ...simpleOptions };
      }

      let widgetOptions = {
        ...options,
        ...{
          symbol: this.platformName ? this.platformName + ':' + this.symbol + 'USD' : this.symbol,
          datafeed: new Datafeed(this.datafeedUrl),
          interval: this.interval,
          container_id: this.containerId,
          library_path: this.libraryPath,
          charts_storage_url: this.chartsStorageUrl,
          charts_storage_api_version: this.chartsStorageApiVersion,
          client_id: this.clientId,
          user_id: this.userId,
          fullscreen: this.fullscreen,
          autosize: this.autosize,
          studies_overrides: this.studiesOverrides,
          theme: this.getTheme(this.themeId),
        },
      };

      if (this.styleArea) {
        widgetOptions.overrides['mainSeriesProperties.style'] = 3;
        widgetOptions.disabled_features.push('control_bar');
        widgetOptions.disabled_features.push('timezone_menu');
        widgetOptions.disabled_features.push('chart_property_page_timezone_sessions');
        widgetOptions.disabled_features.push('main_series_scale_menu');
        widgetOptions.disabled_features.push('scales_context_menu');
        widgetOptions.time_frames = [];
        widgetOptions.timeframe = 'W';
      }

      if (!this.topToolbar) {
        widgetOptions.disabled_features.push('header_widget_dom_node');
        widgetOptions.disabled_features.push('symbol_search_hot_key');
        widgetOptions.disabled_features.push('header_resolutions');
        widgetOptions.disabled_features.push('header_chart_type');
        widgetOptions.disabled_features.push('header_settings');
        widgetOptions.disabled_features.push('header_widget');
      }

      if (this.themeId == '2') {
        widgetOptions.overrides['mainSeriesProperties.areaStyle.color1'] = '#0c2947';
        widgetOptions.overrides['mainSeriesProperties.areaStyle.color2'] = '#0c2947';
        widgetOptions.overrides['mainSeriesProperties.areaStyle.linecolor'] = '#3399FF';
      }

      return widgetOptions;
    },
    initWidget() {
      const container = document.querySelector(`#${this.containerId}`);
      if (!container) {
        this.initTimeout = setTimeout(() => {
          this.initWidget();
        });
        return;
      }
      this.removeWidget();
      this.$api.get(`/coins/${this.slug}`).then(({ coin }) => {
        this.platformName = coin.tradingview_trading_platform_name;
        if (coin.tradingview_trading_platform_name) {
          this.initWithWebsockets();
        } else {
          this.initWithOurAPI();
        }
      });
    },
    initSimpleWidget() {
      const container = document.querySelector(`#${this.containerId}`);
      if (!container) {
        this.initTimeout = setTimeout(() => {
          this.initSimpleWidget();
        });
        return;
      }
      this.removeWidget();
      this.$api.get(`/coins/${this.slug}`).then(({ coin }) => {
        this.platformName = coin.tradingview_trading_platform_name;
        this.initSimpleTradingview(!!coin.tradingview_trading_platform_name);
      });
    },
    initWithWebsockets(options) {
      const localOptions = options || this.getWidgetOptions();
      this.tvWidget = new window.TradingView.widget(localOptions);
      isWidgetExists = true;
    },
    initWithOurAPI(options) {
      const localOptions = options || this.getWidgetOptions();
      this.tvWidget = new widget(localOptions);
      isWidgetExists = true;
    },
    initSimpleTradingview(isWebsockets = true) {
      const options = this.getWidgetOptions(true);
      if (isWebsockets) {
        this.initWithWebsockets(options);
      } else {
        this.initWithOurAPI(options);
      }
    },
    removeWidget() {
      if (this.tvWidget) {
        try {
          this.tvWidget.remove();
        } catch (e) {}
        this.tvWidget = null;
        isWidgetExists = false;
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
