const ACCESS_TOKEN_KEY = 'vue-authenticate.vueauth_token';
const ACCESS_LOCAL_TOKEN_KEY = 'vue-authenticate.vueauth_local_token';

function setAccessToken(accessToken, isLocal) {
  const key = isLocal ? ACCESS_LOCAL_TOKEN_KEY : ACCESS_TOKEN_KEY;
  localStorage.setItem(key, accessToken);
}

function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token;
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export default {
  token: null,
  get(isLocal = false) {
    if (this.token) {
      return this.token;
    } else {
      let token = getAccessToken(isLocal);
      this.token = token;
      return token;
    }
  },
  set(token, isLocal) {
    // set(token, userDetails, isLocal) {
    this.token = token;
    // console.log('userDetails:::::', token, userDetails, isLocal);
    return setAccessToken(token, isLocal);
    // return [setAccessToken(token, isLocal), setUserDetails(userDetails)];
  },
  clear() {
    this.token = null;
    return clearAccessToken();
  },
};
