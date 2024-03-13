export default {
  setProjectsICO(state, data) {
    state.projects = data.data;
    state.allProjects = data.count;
  },
};
