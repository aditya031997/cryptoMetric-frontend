export default {
  getHistoryAlerts(state) {
    return state.alerts;
  },
  getHistoryTotal(state) {
    return state.total;
  },
  getHistoryCurrent(state) {
    return state.current;
  },
  getHistoryTotalPage(state) {
    return state.totalPage;
  },
  getHistoryLinks(state){
    return state.links;
  },
  getAlertsUser(state) {
    return state.alertsUser;
  },
  getAlertsUserLength(state) {
    return state.alertsUser.length;
  },
};
