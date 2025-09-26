<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  // Support both n-input style v-model:value and vanilla v-model
  value?: string | number | null
  modelValue?: string | number | null
}>(), {})

const emit = defineEmits<{
  (e: 'update:value', v: string | number | null): void
  (e: 'update:modelValue', v: string | number | null): void
}>()

const internalValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : props.value
)

function handleUpdate(v: string | number | null) {
  emit('update:value', v)
  emit('update:modelValue', v)
}
</script>

<template>
  <n-input
    v-bind="$attrs"
    :value="internalValue as any"
    @update:value="handleUpdate"
    :theme-overrides="{
      borderRadius: '1rem',
      border: 'none',
      textColor: 'var(--foreground)'
    }"
  />
</template>
