export default {
  setLatestNews(state, news) {
    state.news = news.data;
    state.total = news.last_page;
    state.current = news.current_page;
  },
};
