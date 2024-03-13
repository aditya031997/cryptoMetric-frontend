import DashboardHome from '../pages/dashboard-home.vue';
import DashboardNews from '../pages/dashboard-news.vue';
import DashboardMarkets from '../pages/dashboard-markets.vue';
import DashboardCoin from '../pages/dashboard-coin.vue';
import DashboardIco from '../pages/dashboard-ico.vue';
import DashboardProfile from '../pages/dashboard-profile.vue';
import DashboardAlerts from '../pages/dashboard-alerts.vue';
import DashboardUsers from '../pages/dashboard-users.vue';
import DashboardUser from '../pages/dashboard-user.vue';
import DashboardBubble from '../pages/top-token-by-marketCap.vue';
import roles from './roles';

export default [
  {
    path: '/home',
    name: 'dashboard-home',
    component: DashboardHome,
    meta: { requiresAuth: true, headerName: 'Home' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: DashboardProfile,
    meta: { requiresAuth: true, headerName: 'Profile', isUserNameHeader: true },
  },
  {
    path: '/news',
    name: 'news',
    component: DashboardNews,
    meta: { requiresAuth: true, headerName: 'News' },
  },
  {
    path: '/crypto-markets',
    name: 'crypto-markets',
    component: DashboardMarkets,
    meta: { requiresAuth: true, headerName: 'Crypto Markets' },
  },
  {
    path: '/crypto-markets/:slug',
    name: 'coin-page',
    component: DashboardCoin,
    meta: { requiresAuth: true, headerName: 'Crypto Markets', isButtonBack: true },
  },
  {
    path: '/ico-calendar',
    name: 'ico-calendar',
    component: DashboardIco,
    meta: { requiresAuth: true, headerName: 'ICO Calendar' },
  },
  {
    path: '/bubble',
    name: 'bubble',
    component: DashboardBubble,
    meta: { requiresAuth: true, headerName: 'Bubble' },
  },
  {
    path: '/alerts',
    name: 'alerts',
    component: DashboardAlerts,
    meta: { requiresAuth: true, headerName: 'Alerts' },
  },
  {
    path: '/users',
    name: 'users',
    component: DashboardUsers,
    meta: { requiresAuth: true, headerName: 'Users', roles: [roles.admin] },
  },
  {
    path: '/users/:user',
    name: 'user',
    component: DashboardUser,
    meta: { requiresAuth: true, headerName: 'Users', isButtonBack: true, roles: [roles.admin] },
  },
];
