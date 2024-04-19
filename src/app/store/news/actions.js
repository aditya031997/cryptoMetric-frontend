import { apiInstance } from "@/utils/helpers/api-client";
import accessToken from '../../utils/helpers/access-token';
import configs from '../../../configs/configs';
import axios from 'axios';

export default {
  getNews(context, params) {
    return axios.get(`${configs.API_URL}/news`, {
      params: params,
      headers: {
        Authorization: `Bearer ${accessToken.get()}`,
      },
    })
    .then((response) => {
      const { emailNewsNotificationLevel, news } = response.data;
      context.commit('setNews', news);
      return { emailNewsNotificationLevel, news };
    })
    .catch((error) => {
      console.error('Error getting news:', error);
      throw error;
    });
  },
  unsubscribeNews(params) {
    return axios.post(`${configs.API_URL}/news/${params.id}/unsubscribe`, undefined, {
      headers: {
        Authorization: `Bearer ${accessToken.get()}`,
        'Signature': params.signature,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error unsubscribing from news:', error);
      throw error;
    });
  },
  unsubscribeAlerts(params) {
    return axios.post(`${configs.API_URL}/alerts/${params.id}/unsubscribe`, undefined, {
      headers: {
        Authorization: `Bearer ${accessToken.get()}`,
        'Signature': params.signature,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error unsubscribing from alerts:', error);
      throw error;
    });
  },
};
