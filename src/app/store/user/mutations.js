export default {
  setUser(state, payload) {
    state.data = payload;
  },
  getTheme(state, theme) {
    state.data.chart_theme = theme;
  },
  changeEmailStatus(state, payload) {
    state.data.email_news_notification_level = payload;
  },
  updateUserInfo(state, data) {
    state.data.firstname = data.first_name;
    state.data.lastname = data.last_name;
  },
  updateChartTheme(state, data) {
    state.data.chart_theme = data;
  },
  setStatusAlertEmail(state, data) {
    state.data.email_alert_status = data;
  },
  changeStatusAlertUser(state, data) {
    if (data.alert_type === 0) {
      state.data.is_new_coin_alert_enabled = data.status;
    }
    if (data.alert_type === 1) {
      state.data.is_increase_alert_enabled = data.status;
    }
    if (data.alert_type === 2) {
      state.data.is_decrease_alert_enabled = data.status;
    }
  },
};
