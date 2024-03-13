export default {
  setNews(state, payload) {
    state.list = payload.data;
    const links = payload.links;
    links.pop()
    links.shift()
    state.links = links;
    state.current = payload.current_page;
    state.total = payload.last_page;
  },
};
