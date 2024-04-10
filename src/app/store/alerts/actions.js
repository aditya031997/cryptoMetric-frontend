import { apiInstance } from "@/utils/helpers/api-client";


export default {
  getHistoryAlerts({ commit, state }, data) {
    const { isEcho, page, per_page } = data;
    return apiInstance()
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
    return apiInstance().get('/alerts').then(({ alerts }) => {
      context.commit('setAlertsUser', alerts);
    });
  },
  postCreateAlert(context, data) {
    return apiInstance().post('/alerts', data.data).then(({ alert }) => {
      const alertCreated = { ...alert, ...data.coin };
      context.commit('setCreatedAlert', alertCreated);
    });
  },
  deleteAlertUser(context, id) {
    return apiInstance().delete(`/alerts/${id}`).then(() => {
      context.commit('deleteAlertUser', id);
    });
  },
  changeStatusAlertUser(context, data) {
    return apiInstance().post('/alerts/toggle-status', data).then(() => {
      context.commit('changeStatusAlertUser', data);
    });
  },
  changeStatusAlertEmail(context, data) {
    return apiInstance().post('/alerts/toggle-email-status', data).then(() => {
      context.commit('setStatusAlertEmail', data.status);
    });
  },
};
