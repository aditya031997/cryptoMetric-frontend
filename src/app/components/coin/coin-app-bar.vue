<template>
  <div class="coin-bar">
    <p
      v-for="(element, index) in list"
      :key="element.id"
      @click="changeAppBarTitle(index)"
      class="coin-bar__title"
      :class="{ 'is-active': element.isActive }"
    >
      {{ element.name }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
    },
    onChange: {
      type: Function,
    },
  },
  methods: {
    changeAppBarTitle(index) {
      this.onChange(index);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
