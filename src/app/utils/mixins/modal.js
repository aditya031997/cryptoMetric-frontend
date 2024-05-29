export default {
  data: () => ({
    isModal: false,
  }),
  methods: {
    onOpenModal() {
      this.isModal = true;
      document.body.classList.add("modal-open");
    },
    onCloseModal() {
      this.isModal = false;
      document.body.classList.remove("modal-open");
    },
  },
};
