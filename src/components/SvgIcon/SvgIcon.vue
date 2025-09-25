<template>
  <span
    class="svg-icon inline-flex items-center justify-center"
    v-html="svg"
  />
</template>

<script setup lang="ts">
interface Props {
  svg: string
}
defineProps<Props>();
</script>

<style scoped>
.svg-icon {
  line-height: 0; 
  vertical-align: middle;
  width: 100%;
  height: 100%;
}
.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  fill: currentColor;
}
</style>