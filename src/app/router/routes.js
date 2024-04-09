import AuthPages from './auth';
import DashboardPages from './dashboard';
import UnsubscribePages from './unsubscribe';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  ...AuthPages,
  ...DashboardPages,
  ...UnsubscribePages,
  {
    path: '/:pathMatch(.*)',
    name: 'not-found',
    redirect: '/home',
  },
];

export default routes;
