import { mapGetters } from 'vuex';

export default {
  data: () => ({
    theme: 0,
  }),
  mounted() {
    this.theme = this.getTheme(this.themeId);
  },
  computed: {
    ...mapGetters({
      themeId: 'getTheme',
    }),
  },
  methods: {
    getTheme(theme_id) {
      theme_id = parseInt(theme_id);
      if (theme_id === 2) {
        return 'Dark';
      } else {
        return 'Light';
      }
    },
  },
};
