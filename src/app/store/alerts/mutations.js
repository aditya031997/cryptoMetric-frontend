export default {
  setHistoryAlerts(state, alerts) {
    state.alerts = alerts.data;
    state.total = alerts.meta.total;
    const links = alerts.meta.links;
    links.pop();
    links.shift();
    state.links = links;
    state.current = alerts.meta.current_page;
    state.totalPage = alerts.meta.last_page;
  },
  setAlertsUser(state, alerts) {
    state.alertsUser = alerts;
  },
  setCreatedAlert(state, alert) {
    state.alertsUser.push(alert);
  },
  deleteAlertUser(state, id) {
    const indexAlert = state.alertsUser.findIndex((alert) => alert.id === id);
    if (indexAlert !== -1) {
      state.alertsUser.splice(indexAlert, 1);
    }
  },
  
};
