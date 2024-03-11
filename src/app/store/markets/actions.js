import { serialize } from '@/utils/helpers/serialize';

export default {
  getCoinsMarkets(context, data) {
    const dataSerialize = serialize(data);
    return this._vm.$api.get(`/crypto-markets?${dataSerialize}`, {}).then((data) => {
      context.commit('setCoinsMarkets', data);
    });
  },
};
