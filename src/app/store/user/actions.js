import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getUser(context) {
    return apiInstance().get('/user').then((data) => {
      context.commit('setUser', data);
    });
  },
  changeEmailStatus(context, data) {
    return apiInstance().post('/user/email-news-status', { status: data.status }).then(() => {
      context.commit('changeEmailStatus', data.name);
    });
  },
  changeTheme(context, data) {
    return apiInstance().post('/user/chart-theme', { chart_theme: data }).then(() => {
      context.commit('getTheme', data);
    });
  },
  changeUserInfo(context, data) {
    console.debug({ api: apiInstance() })
    return apiInstance().patch('/profile', data).then(() => {
      context.commit('updateUserInfo', data);
    });
  },
  updatePassword(context, data) {
    return apiInstance().patch('/profile/update-password', data);
  },
};
