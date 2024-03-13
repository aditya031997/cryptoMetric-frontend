const ACCESS_TOKEN_KEY = 'vue-authenticate.vueauth_token';

// Get and store access_token in local storage
function setAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export default {
  token: null,
  get() {
    if (this.token) {
      return this.token;
    } else {
      let token = getAccessToken();
      this.token = token;
      return token;
    }
  },
  set(token) {
    this.token = token;
    return setAccessToken(token);
  },
  clear() {
    this.token = null;
    return clearAccessToken();
  },
};
