import Echo from 'laravel-echo';
import configs from '../../configs/configs';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

const EchoClass = new Echo({
  broadcaster: 'pusher',
  key: configs.PUSHER_APP_KEY,
  cluster: configs.PUSHER_APP_CLUSTER,
  encrypted: false,
});

const getListenerEcho = (event, callback) => {
  const channel = configs.PUSHER_APP_CHANNEL;
  return EchoClass.channel(channel).listen(event, callback);
};
const stopListenerEcho = (event) => {
  const channel = configs.PUSHER_APP_CHANNEL;
  EchoClass.channel(channel).stopListening(event);
};

export { EchoClass, getListenerEcho, stopListenerEcho };
