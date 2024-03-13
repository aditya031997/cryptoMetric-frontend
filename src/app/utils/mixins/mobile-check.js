export default {
  data: () => ({
    isMobile: false,
  }),
  beforeMount() {
    this.mobileCheck();
    window.addEventListener('resize', this.mobileCheck);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.mobileCheck);
  },
  methods: {
    mobileCheck() {
      this.isMobile = window.matchMedia('(max-width: 991px)').matches;
    },
  },
};
