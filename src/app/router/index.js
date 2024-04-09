import Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import accessToken from '../utils/helpers/access-token';
import store from '../store';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = !!accessToken.get();
  const requiresAuth = !!to.meta?.requiresAuth;
  if (to.name !== 'not-found' && to.name !== 'unsubscribe-news' && to.name !== 'unsubscribe-alerts') {
    if (!isAuth && requiresAuth) {
      return next({ path: '/login' });
    }
    if (isAuth && !requiresAuth) {
      return next({ path: '/home' });
    }
  }
  next();
});

export default router;
