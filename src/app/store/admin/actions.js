export default {
  getUsers(context, data) {
    return this._vm.$api.get('/admin/users', { ...data }).then((data) => {
      context.commit('setUsers', data);
    });
  },
  adminUpdatePassword(context, data) {
    return this._vm.$api.post(`/admin/users/${data.id}/update-password`, data.passwords);
  },
  getAdminUser(context, user) {
    return this._vm.$api.get(`/admin/users/${user}`);
  },
  postInviteUser(context, email) {
    return this._vm.$api.post('/admin/users', { email });
  },
};
