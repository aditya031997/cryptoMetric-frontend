<template>
  <picture class="cm-picture">
    <source
      v-if="jpgSrc.length"
      :srcset="jpgSrc"
      type="image/jpg"
    />
    <source
      v-if="pngSrc.length"
      :srcset="pngSrc"
      type="image/png"
    />
    <source
      v-if="webpSrc.length"
      :srcset="webpSrc"
      type="image/webp"
    />
    <img
      :src="fallback"
      :alt="alt"
    />
  </picture>
</template>

<script>
function imgsValidator(value) {
  return (
    !value || (Array.isArray(value) && value.every((item) => item.hasOwnProperty('src') && item.hasOwnProperty('size')))
  );
}

export default {
  name: 'cm-picture',
  props: {
    jpgs: {
      type: Array,
      default: null,
      validator: imgsValidator,
    },
    pngs: {
      type: Array,
      default: null,
      validator: imgsValidator,
    },
    webps: {
      type: Array,
      default: null,
      validator: imgsValidator,
    },
    fallback: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
  computed: {
    jpgSrc() {
      return this.arrayToSource(this.jpgs);
    },
    pngSrc() {
      return this.arrayToSource(this.pngs);
    },
    webpSrc() {
      return this.arrayToSource(this.webps);
    },
  },
  methods: {
    arrayToSource(array) {
      return array?.length ? array.map((item) => `${item.src} ${item.size}`).join(', ') : '';
    },
  },
};
</script>

<style></style>
