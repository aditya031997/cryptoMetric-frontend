import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getUsers(context, data) {
    return apiInstance()?.get('/admin/users', { ...data })
      .then(({ data }) => {
        context.commit('setUsers', data);
        return data;
      })
      .catch((error) => {
        console.error('Error getting users:', error);
        throw error;
      });
  },
  adminUpdatePassword(data) {
    return apiInstance()?.get(`/admin/users/${data.id}/update-password`,data.passwords)
  },
  getAdminUser(user) {
    return apiInstance()?.get(`/admin/users/${user}`)
  },
  postInviteUser(email) {
    return apiInstance()?.post('/admin/users', { email })
  },
};
