<script setup lang="ts">
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { computed } from 'vue'
import { getCSSVariable } from '@/utils/cssUtil';

interface ButtonProps {
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  size?: 'tiny' | 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  ghost?: boolean
  round?: boolean
  circle?: boolean
  color?: string
  textColor?: string
  icon?: any
  [key: string]: any
}

const props = withDefaults(defineProps<ButtonProps>(),{
  size: 'medium'
})

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

const designStore = useDesignSettingStore()

const colorTypeMap = {
  primary: '--primary',
  info: '--info',
  success: '--success',
  warning: '--warning',
  error: '--error'
} as const

const coloredTypes = ['primary', 'info', 'success', 'warning', 'error'] as const

const buttonProps = computed(() => {
  const { icon, ...rest } = props
  if (!rest.color && rest.type && rest.type in colorTypeMap) {
    rest.color = getCSSVariable(colorTypeMap[rest.type as keyof typeof colorTypeMap])
  }
  if (rest.color && rest.type && coloredTypes.includes(rest.type as any) && !rest.ghost && designStore.darkTheme) {
    rest.textColor = 'white'
  }
  return rest
})

const sizeClassMap: Record<string, string> = {
  tiny: 'h-6 px-2 text-xs',
  small: 'h-7 px-2.5 text-sm',
  medium: 'h-8 px-3 text-sm',
  large: 'h-9 px-4 text-base'
}

const buttonClass = computed(() => {
  const classes = ['naive-button-override']
  if (designStore.darkTheme) classes.push('dark')
  if (props.round) classes.push('round')
  if (props.circle) classes.push('circle')
  if (props.size && sizeClassMap[props.size]) classes.push(sizeClassMap[props.size])
  return classes.join(' ')
})
</script>

<template>
  <n-button v-bind="buttonProps" v-on="$attrs"
    :class="buttonClass"
    @click="emit('click', $event)">
    <template #icon v-if="props.icon">
      <component :is="props.icon" class="w-4 h-4"/>
    </template>
    <slot />
  </n-button>
</template>

<style scoped>
.naive-button-override {
  border-radius: 5px;
}

.naive-button-override.round {
  border-radius: 9999px;
}

.naive-button-override.circle {
  border-radius: 50% !important;
  aspect-ratio: 1 / 1;
}

.naive-button-override:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.naive-button-override.loading {
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
