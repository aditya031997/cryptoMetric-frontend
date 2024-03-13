export default {
  getUsers(state) {
    return state.users;
  },
  getLinksAdmin(state) {
    return state.links;
  },
  getCurrent(state) {
    return state.current;
  },
  getTotal(state) {
    return state.total;
  },
  getUsersLength(state) {
    return state.users.length;
  },
};
