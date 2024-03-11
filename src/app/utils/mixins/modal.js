export default {
  data: () => ({
    isModal: false,
  }),
  methods: {
    onOpenModal() {
      this.isModal = true;
    },
    onCloseModal() {
      this.isModal = false;
    },
  },
};
