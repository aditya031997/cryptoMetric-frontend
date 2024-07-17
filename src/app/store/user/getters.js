export default {
  getUser(state) {
    return state.data;
  },
  getChainId(state) {
    // console.log('Getter state:', state); // Debugging line
    return state.data.networkId;
  },
  getUserName(state) {
    if (state.data?.firstname) {
      return state.data?.firstname;
    }
    return '';
  },
  getUserFullName(state) {
    let name = '';
    if (state.data?.firstname) {
      name += state.data?.firstname;
    }
    if (state.data?.lastname) {
      name += ' ' + state.data?.lastname;
    }
    return name;
  },
  getTheme(state) {
    return state?.data?.chart_theme;
  },
  getEmailUser(state) {
    return state?.data?.email || '';
  },
};
