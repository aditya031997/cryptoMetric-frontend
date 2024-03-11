export default {
  getNewsList(state) {
    return state.list;
  },
  getCurrentPage(state) {
    return state.current;
  },
  getTotalPage(state) {
    return state.total;
  },
  getLinksNews(state) {
    return state.links;
  },
};
