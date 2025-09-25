<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import searchIcon from './Icon';
import { SvgIcon } from '../SvgIcon';

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <div class="search-box rounded-full border-box px-2">
    <div class="flex justify-center items-center mx-1">
      <SvgIcon :svg="searchIcon" class="w-4 h-4 text-accent"/>        
    </div>
    <input v-model="modelValue" class="ml-1 px-2 rounded-tr-full rounded-br-full h-5"/>
  </div>
</template>

<style scoped lang="less">
.search-box {
    border: 1px solid var(--accent);
    display: flex;
    align-items: center;
    SvgIcon {
      display: block;
    }
    .divider {
      margin: 0 0.5rem;
      background: var(--accent);
    }
    input {
      border-left: 1px solid var(--accent);
      margin: 0.4rem 0;
      outline: none;
      background: transparent;
    }
}
</style>