<template>
  <main class="page-auth">
    <section
      class="page-auth__slider"
      style=""
    >
      <div class="page-auth__wrapper">
        <flickity
          class="page-auth__flickity"
          ref="flickity"
          :options="flickityOptions"
          @ini="afterSliderInit"
        >
          <div
            class="page-auth__flickity-item"
            v-for="slide in slides"
            :key="slide.x1"
          >
            <cm-picture
              :pngs="[
                { src: slide.x1, size: '1x' },
                { src: slide.x2, size: '2x' },
              ]"
              :webps="[
                { src: slide.webpx1, size: '1x' },
                { src: slide.webpx2, size: '2x' },
              ]"
              :fallback="slide.x1"
              :alt="slide.alt"
            />
          </div>
        </flickity>
        <p class="text text--title-3">Start using CryptoMetric</p>
        <p class="text text--caption">Crypto Analysis Tool</p>
      </div>
    </section>
    <section class="page-auth__content">
      <div
        class="page-auth__wrapper"
        :class="{ 'is-register': $route.name === 'register' }"
      >
        <slot></slot>
      </div>
      <div
        v-if="isLoad"
        class="auth-form__loader"
      >
        <cm-loader />
      </div>
    </section>
  </main>
</template>

<script>
import Flickity from 'vue-flickity';
import CmPicture from '@/components/cm-picture';
import CmLoader from '@/components/ui/loader/cm-loader';

// -- TODO: replace stub with real data
import ImgHomex1 from '@/assets/images/auth-slider/home.png';
import ImgHomex2 from '@/assets/images/auth-slider/home_x2.png';
import ImgHomeWebpx1 from '@/assets/images/auth-slider/home.webp';
import ImgHomeWebpx2 from '@/assets/images/auth-slider/home_x2.webp';
import ImgMarketsx1 from '@/assets/images/auth-slider/markets.png';
import ImgMarketsx2 from '@/assets/images/auth-slider/markets_x2.png';
import ImgMarketsWebpx1 from '@/assets/images/auth-slider/markets.webp';
import ImgMarketsWebpx2 from '@/assets/images/auth-slider/markets_x2.webp';
import ImgCalendarx1 from '@/assets/images/auth-slider/calendar.png';
import ImgCalendarx2 from '@/assets/images/auth-slider/calendar_x2.png';
import ImgCalendarWebpx1 from '@/assets/images/auth-slider/calendar.webp';
import ImgCalendarWebpx2 from '@/assets/images/auth-slider/calendar_x2.webp';
// --

export default {
  name: 'layout-auth',
  components: {
    Flickity,
    CmPicture,
    CmLoader,
  },
  data: () => ({
    isLoad: false,
    flickityOptions: {
      prevNextButtons: false,
      pageDots: true,
      wrapAround: true,
      freeScroll: false,
      autoPlay: 5000,
      adaptiveHeight: true,
      imagesLoaded: true,
      resize: true,
    },
    // -- TODO: replace stub with real data
    slides: [
      {
        alt: 'Screen of dashboard home page',
        x1: ImgHomex1,
        x2: ImgHomex2,
        webpx1: ImgHomeWebpx1,
        webpx2: ImgHomeWebpx2,
      },
      {
        alt: 'Screen of dashboard markets page',
        x1: ImgMarketsx1,
        x2: ImgMarketsx2,
        webpx1: ImgMarketsWebpx1,
        webpx2: ImgMarketsWebpx2,
      },
      {
        alt: 'Screen of dashboard calendar page',
        x1: ImgCalendarx1,
        x2: ImgCalendarx2,
        webpx1: ImgCalendarWebpx1,
        webpx2: ImgCalendarWebpx2,
      },
    ],
    // --
  }),
  beforeMount() {
    this.$root.$on('set-auth-loading', this.setLoading);
  },
  beforeDestroy() {
    this.$root.$off('set-auth-loading', this.setLoading);
  },
  methods: {
    afterSliderInit() {
      this.$flickity.reposition();
    },
    setLoading(state) {
      this.isLoad = state;
    },
  },
};
</script>

<style></style>
