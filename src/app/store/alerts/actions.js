export default {
  getHistoryAlerts({ commit, state }, data) {
    const { isEcho, page, per_page } = data;
    return this._vm.$api
      .get(
        '/alerts/history',
        isEcho
          ? {
              page: state.current,
              per_page,
            }
          : {
              page,
              per_page,
            }
      )
      .then(({ alerts }) => {
        commit('setHistoryAlerts', alerts);
      });
  },
  getAlertsUser(context) {
    return this._vm.$api.get('/alerts').then(({ alerts }) => {
      context.commit('setAlertsUser', alerts);
    });
  },
  postCreateAlert(context, data) {
    return this._vm.$api.post('/alerts', data.data).then(({ alert }) => {
      const alertCreated = { ...alert, ...data.coin };
      context.commit('setCreatedAlert', alertCreated);
    });
  },
  deleteAlertUser(context, id) {
    return this._vm.$api.delete(`/alerts/${id}`).then(() => {
      context.commit('deleteAlertUser', id);
    });
  },
  changeStatusAlertUser(context, data) {
    return this._vm.$api.post('/alerts/toggle-status', data).then(() => {
      context.commit('changeStatusAlertUser', data);
    });
  },
  changeStatusAlertEmail(context, data) {
    return this._vm.$api.post('/alerts/toggle-email-status', data).then(() => {
      context.commit('setStatusAlertEmail', data.status);
    });
  },
};
