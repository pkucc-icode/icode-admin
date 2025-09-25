<script setup lang="ts">
import { computed, h } from 'vue'
import type { VNodeChild } from 'vue'
import {
  Select as BaseSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './src/index';

// Option item shape
export interface SelectOptionItem {
  label: string | VNodeChild
  value: string | number
  disabled?: boolean
  icon?: any // optional component for left icon
}

// Grouped shape
export interface SelectGroupItem {
  label: string
  options: SelectOptionItem[]
}

type OptionsProp = Array<SelectOptionItem | SelectGroupItem>

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options: OptionsProp
  placeholder?: string
  disabled?: boolean
  class?: string
}>(), {
  placeholder: 'Select...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v?: string | number): void
  (e: 'change', v?: string | number): void
}>()

const isGroup = (o: SelectOptionItem | SelectGroupItem): o is SelectGroupItem => {
  return (o as SelectGroupItem).options !== undefined
}

const flatOptions = computed<SelectOptionItem[]>(() => {
  const result: SelectOptionItem[] = []
  for (const item of props.options) {
    if (isGroup(item)) {
      result.push(...item.options)
    } else {
      result.push(item)
    }
  }
  return result
})

// Internal value is string; keep original mapping
const internalValue = computed<string | undefined>(() => {
  if (props.modelValue === undefined || props.modelValue === null) return undefined
  return String(props.modelValue)
})

const selectedOption = computed<SelectOptionItem | undefined>(() => {
  if (props.modelValue === undefined || props.modelValue === null) return undefined
  return flatOptions.value.find(o => String(o.value) === String(props.modelValue))
})

function updateValue(v?: string) {
  if (v == null) {
    emit('update:modelValue', undefined)
    emit('change', undefined)
    return
  }
  const found = flatOptions.value.find(o => String(o.value) === v)
  const out = found ? found.value : v
  emit('update:modelValue', out as any)
  emit('change', out as any)
}
</script>

<template>
  <BaseSelect :value="internalValue" :disabled="disabled" @update:value="updateValue">
    <SelectTrigger :class="['w-full bg-shallow placeholder:text-shallow-foreground text-text  border-none', props.class]">
      <SelectValue :placeholder="placeholder">
        <template v-if="selectedOption">
          <component v-if="selectedOption.icon" :is="selectedOption.icon" class="mr-2 h-4 w-4" />
          <span>{{ typeof selectedOption.label === 'string' ? selectedOption.label : '' }}</span>
          <span v-if="typeof selectedOption.label !== 'string'">
            <component :is="selectedOption.label as any" />
          </span>
        </template>
      </SelectValue>
    </SelectTrigger>

    <SelectContent class="bg-shallow">
      <template v-for="(item, idx) in options" :key="idx">
        <template v-if="isGroup(item)">
          <SelectGroup>
            <SelectLabel>{{ item.label }}</SelectLabel>
            <SelectItem v-for="opt in item.options"
                        :key="String(opt.value)"
                        :value="String(opt.value)"
                        :disabled="opt.disabled">
              <component v-if="opt.icon" :is="opt.icon" class="mr-2 h-4 w-4" />
              <span>{{ typeof opt.label === 'string' ? opt.label : '' }}</span>
              <span v-if="typeof opt.label !== 'string'">
                <component :is="opt.label as any" />
              </span>
            </SelectItem>
          </SelectGroup>
        </template>
        <template v-else>
          <SelectItem :value="String((item as any).value)" :disabled="(item as any).disabled">
            <component v-if="(item as any).icon" :is="(item as any).icon" class="mr-2 h-4 w-4" />
            <span>{{ typeof (item as any).label === 'string' ? (item as any).label : '' }}</span>
            <span v-if="typeof (item as any).label !== 'string'">
              <component :is="(item as any).label as any" />
            </span>
          </SelectItem>
        </template>
      </template>
    </SelectContent>
  </BaseSelect>
</template>
