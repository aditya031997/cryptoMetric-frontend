import Login from '../pages/login.vue';
import ResetPassword from '../pages/reset-password.vue';
import ForgotPassword from '../pages/forgot-password.vue';
import Register from '../pages/register.vue';
import layouts from '../layouts/layouts';

export default [
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false, layout: layouts.auth },
    component: Login,
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    meta: { requiresAuth: false, layout: layouts.auth  },
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    meta: { requiresAuth: false, layout: layouts.auth  },
    component: ResetPassword,
  },
  {
    path: '/register',
    name: 'register',
    meta: { requiresAuth: false, layout: layouts.auth  },
    component: Register,
  },
];
