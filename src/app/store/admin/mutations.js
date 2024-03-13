export default {
  setUsers(state, payload) {
    state.users = payload.data;
    state.current = payload.meta.current_page;
    state.total = payload.meta.last_page;
    const links = payload.meta.links;
    links.pop()
    links.shift()
    state.links = links;
  },
};
