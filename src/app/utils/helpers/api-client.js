import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentInstance } from "vue";
import accessToken from './access-token';
import configs from '#/configs/configs';


export const apiInstance = function () {
  const api = getCurrentInstance()?.appContext.config.globalProperties?.$api;
  return api;
};

export default {
  accessToken: accessToken,
  queryStack: {},
  maxResendTriesCount: 5,
  options: {
    baseURL: `${configs.API_URL}/`,
    headers: {},
  },

  get(url, params = {}, headers = {}) {
    this.setAuthBearer();
    const options = this.options;
    options.url = url;
    options.method = 'GET';
    options.params = params;
    options.headers = { ...options.headers, ...headers };

    return this.sendQuery(options);
  },

  delete(url, params = {}) {
    this.setAuthBearer();

    const options = this.options;
    options.url = url;
    options.method = 'DELETE';
    options.params = params;

    return this.sendQuery(options);
  },

  post(url, data = {}, params = {}) {
    this.setAuthBearer();

    const options = this.options;
    options.url = url;
    options.method = 'POST';
    options.data = data;
    options.params = params;

    return this.sendQuery(options);
  },

  patch(url, data = {}, params = {}) {
    this.setAuthBearer();

    const options = this.options;
    options.url = url;
    options.method = 'PATCH';
    options.data = data;
    options.params = params;

    return this.sendQuery(options);
  },

  put(url, data = {}, params) {
    this.setAuthBearer();

    const options = this.options;
    options.url = url;
    options.method = 'PUT';
    options.data = data;
    options.params = params;

    return this.sendQuery(options);
  },

  generateUUID(options) {
    return options.url + JSON.stringify(options.params) + JSON.stringify(options.data ? options.data : {});
  },

  sendQuery(options) {
    const queryOptions = Object.assign({}, options);
    queryOptions.uuid = this.generateUUID(queryOptions);
    queryOptions.queryUUID = uuidv4();
    queryOptions.listenerUUID = `load-query-${queryOptions.uuid}`;

    if (!this.queryStack[queryOptions.uuid]) {
      this.queryStack[queryOptions.uuid] = [];
      this.queryStack[queryOptions.uuid].push(queryOptions.queryUUID);
    } else {
      return new Promise((resolve, reject) => {
        document.addEventListener(queryOptions.listenerUUID, function listener(event) {
          document.removeEventListener(queryOptions.listenerUUID, listener);
          resolve(event.detail);
        });
      });
    }

    const axiosInstance = axios.create();
    return axiosInstance
      .request(queryOptions)
      .then((response) => {
        document.dispatchEvent(new CustomEvent(queryOptions.listenerUUID, { detail: response.data }));
        if (queryOptions.url == '/login') {
          const localOptions = { ...queryOptions, baseURL: `${configs.LOCAL_API_URL}/api` };
          return axiosInstance
            .request(localOptions)
            .then((localResponse) => {
              return { live: response?.data, local: localResponse?.data };
            })
            .catch((localError) => {
              delete this.queryStack[queryOptions.uuid];
              return Promise.reject(localError);
            });
        } else {
          return response.data;
        }
      })
      .catch((errors) => {
        delete this.queryStack[queryOptions.uuid];
        return this.tryResolveErrors(
          errors,
          queryOptions.url,
          queryOptions.data ? queryOptions.data : {},
          queryOptions.params,
          queryOptions.method
        );
      })
      .finally((result) => {
        delete this.queryStack[queryOptions.uuid];
      });
  },

  setAuthBearer() {
    const _token = accessToken.get();
    if (_token) {
      this.options.headers.Authorization = `Bearer ${_token}`;
    } else {
      delete this.options.headers.Authorization;
    }
  },

  tryResolveErrors(errors, url, data = {}, params = {}, type) {
    const accessToken = this.accessToken.get();
    // TODO replace auth refresh url when API will be ready8
    if (!!accessToken && errors && errors?.response?.status === 401 && url !== '/auth/refresh') {
      const options = this.options;
      options.url = '/auth/refresh';
      options.method = 'POST';
      options.params = null;

      return this.post(options.url, null, null)
        .then((response) => {
          if (response.data) {
            this.accessToken.set(response.data.response.auth.access_token);
          } else if (response.response) {
            this.accessToken.set(response.response.auth.access_token);
          } else if (response.auth) {
            this.accessToken.set(response.auth.access_token);
          }

          switch (type) {
            case 'GET':
              return this.get(url, params);
            case 'POST':
              return this.post(url, data, params);
            case 'PATCH':
              return this.patch(url, data, params);
            case 'DELETE':
              return this.delete(url, params);
            case 'PUT':
              return this.put(url, params);
            default:
              return this.get(url, params);
          }
        })
        .catch((innerErrors) => {
          delete this.queryStack[options.uuid];

          this.accessToken.clear();
          window.location.reload();
          return innerErrors.response.data;
        });
    }
    throw errors.response ? errors.response.data : errors;
  },
};
