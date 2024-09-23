import { apiInstance } from '@/utils/helpers/api-client';
import axios from 'axios';
import configs from '../../../configs/configs';

export default {
  getUsers(context, data) {
    return axios
      .get(`${configs.API_URL}/admin/users`, {
        params: {
          ...data,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vue-authenticate.vueauth_token')}`,
        },
      })
      .then((response) => {
        context.commit('setUsers', response.data);
        return response.data;
      })
      .catch((error) => {
        console.error('Error getting users:', error);
        throw error;
      });
  },
  adminUpdatePassword(context, data) {
    const { id, passwords } = data;
    return axios
      .post(`${configs.API_URL}/admin/users/${id}/update-password`, passwords, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vue-authenticate.vueauth_token')}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error updating admin password:', error);
        throw error;
      });
  },
  getAdminUser(context, userId) {
    return axios
      .get(`${configs.API_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vue-authenticate.vueauth_token')}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error getting admin user:', error);
        throw error;
      });
  },
  postInviteUser(context, email) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    // console.log(token,"token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // console.log(config,"config")
    return axios
      .post(`${configs.API_URL}/admin/users`, { email }, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error posting invite user:', error);
        throw error;
      });
  },

  deleteUser(context, id) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    console.log(token, 'token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(config, 'config');
    return axios
      .post(`${configs.API_URL}/admin/users/delete`, { id }, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        throw error;
      });
  },
};
