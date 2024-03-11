import UnsubscribeAlerts from '../pages/unsubscribe-alerts.vue';
import UnsubscribeNews from '../pages/unsubscribe-news.vue';

const routes = [
  {
    path: '/unsubscribe/news',
    name: 'unsubscribe-news',
    component: UnsubscribeNews,
  },
  {
    path: '/unsubscribe/alerts',
    name: 'unsubscribe-alerts',
    component: UnsubscribeAlerts,
  },
];

export default routes;
