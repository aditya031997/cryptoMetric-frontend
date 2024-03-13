import configs from '#/configs/configs';

function getImageCoin(value) {
  return configs.COIN_IMG_URL.replace('_slug_', value);
}

function getBigImageCoin(value) {
  return configs.COIN_BIG_IMG_URL.replace('_slug_', value);
}

function getImageIco(value) {
  return configs.ICO_IMG_URL.replace('_slug_', value);
}

function getImageNews(value) {
  return configs.NEWS_IMG_URL.replace('_slug_', value);
}

function getImageExchanges(value) {
  return configs.EXCHANGES_IMG_URL.replace('_image_', value);
}
export { getImageCoin, getImageNews, getBigImageCoin, getImageExchanges, getImageIco };
