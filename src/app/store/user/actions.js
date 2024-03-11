export default {
  getUser(context) {
    return this._vm.$api.get('/user').then((data) => {
      context.commit('setUser', data);
    });
  },
  changeEmailStatus(context, data) {
    return this._vm.$api.post('/user/email-news-status', { status: data.status }).then(() => {
      context.commit('changeEmailStatus', data.name);
    });
  },
  changeTheme(context, data) {
    return this._vm.$api.post('/user/chart-theme', { chart_theme: data }).then(() => {
      context.commit('getTheme', data);
    });
  },
  changeUserInfo(context, data) {
    return this._vm.$api.patch('/profile', data).then(() => {
      context.commit('updateUserInfo', data);
    });
  },
  updatePassword(context, data) {
    return this._vm.$api.patch('/profile/update-password', data);
  },
};
