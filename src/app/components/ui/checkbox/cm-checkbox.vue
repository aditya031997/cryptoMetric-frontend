<template>
  <label
    class="cm-checkbox"
    :for="id"
  >
    <input
      class="cm-checkbox__input"
      type="checkbox"
      :id="id"
      :checked="value"
      @change="onChange"
    />
    <span
      class="cm-checkbox__button"
      :class="{ 'is-active': this.value }"
    >
      <icon-check />
    </span>
    <p
      class="cm-checkbox__text"
      :class="{ 'is-active': this.value }"
    >
      <slot />
    </p>
  </label>
</template>

<script>
import iconCheck from '../../icons/icon-check.vue';
export default {
  name: 'cm-checkbox',
  components: { iconCheck },
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
    },
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.checked);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
