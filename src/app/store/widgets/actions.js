import { apiInstance } from "@/utils/helpers/api-client";
import axios from 'axios';
import accessToken from '../../utils/helpers/access-token'
import configs from '../../../configs/configs';

export default {
  getOrderList({ commit }) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.get(`${configs.API_URL}/user/widgets`, config)
      .then(({ data }) => {
        commit('setWidgetsOrder', data.widgets);
      })
      .catch(error => {
        console.error('Error fetching order list:', error);
        throw error;
      });
  },
  getWidgets({ commit }) {
    const token = localStorage.getItem('vue-authenticate.vueauth_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.get(`${configs.API_URL}/widgets`, config)
      .then(({ data }) => {
        commit('setWidgetsList', data.widgets);
      })
      .catch(error => {
        console.error('Failed to fetch widgets:', error);
        throw error;
      });
  },

  changePositionOrderWidgets(context, data) {

    const list = data.map((widget, index) => ({ widget_id: widget.widget_id, position: index + 1 }));
    return apiInstance().post('/widgets/user', { widgets: list }).then(() => {
      context.commit('setWidgetsOrder', data);
    });
  },
};
