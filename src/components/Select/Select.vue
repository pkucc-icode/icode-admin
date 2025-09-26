<script setup lang="ts">
import { computed } from 'vue'

// Support both usages: v-model and v-model:value
const props = withDefaults(defineProps<{
  value?: any
  modelValue?: any
  multiple?: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'update:value', v: any): void
  (e: 'update:modelValue', v: any): void
}>()

const internalValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : props.value
)

function handleUpdate(v: any) {
  emit('update:value', v)
  emit('update:modelValue', v)
}
</script>

<template>
  <n-select
    v-bind="$attrs"
    :value="internalValue"
    @update:value="handleUpdate"
    :theme-overrides="{
      borderRadius: '1rem',
    }"
    :multiple="multiple"
  />
</template>
