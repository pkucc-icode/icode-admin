<script setup lang="ts">
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { computed, ref } from 'vue'

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

const props = defineProps<ButtonProps>()

// 继承 NButton 的事件
const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

const designStore = useDesignSettingStore()

// 缓存 CSS 变量值，避免重复计算
const cssVariableCache = ref<Record<string, string>>({})

// 获取 CSS 变量值的函数（带缓存）
const getCSSVariableValue = (variableName: string): string => {
  if (typeof window === 'undefined') return ''
  
  if (cssVariableCache.value[variableName]) {
    return cssVariableCache.value[variableName]
  }
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim()
  
  cssVariableCache.value[variableName] = value
  return value
}

// 预定义颜色映射，避免重复的 switch 判断
const colorTypeMap = {
  primary: '--primary',
  info: '--info', 
  success: '--success',
  warning: '--warning',
  error: '--error'
} as const

// 预定义需要设置白色字体的类型
const coloredTypes = ['primary', 'info', 'success', 'warning', 'error'] as const

// 计算属性，使用 tailwind.css 中定义的 CSS 变量
const buttonProps = computed(() => {
  const { icon, ...rest } = props
  
  // 如果没有手动传 color，根据 type 设置 tailwind.css 中的颜色
  if (!rest.color && rest.type && rest.type in colorTypeMap) {
    rest.color = getCSSVariableValue(colorTypeMap[rest.type as keyof typeof colorTypeMap])
  }
  
  // 对于有颜色的按钮，在暗色主题下强制设置白色字体（排除 ghost 类型）
  if (rest.color && rest.type && coloredTypes.includes(rest.type as any) && !rest.ghost && designStore.darkTheme) {
    rest.textColor = 'white'
  }
  
  return rest
})

// 计算按钮的 class（优化字符串拼接）
const buttonClass = computed(() => {
  const classes = ['naive-button-override']
  
  if (designStore.darkTheme) classes.push('dark')
  if (props.round) classes.push('round')
  if (props.circle) classes.push('circle')
  
  return classes.join(' ')
})
</script>

<template>
  <!-- 外层加一层样式覆盖 -->
  <n-button v-bind="buttonProps" v-on="$attrs" 
    :class="buttonClass"
    @click="emit('click', $event)">
    <template #icon v-if="props.icon">
      <component :is="props.icon" />
    </template>
    <slot />
  </n-button>
</template>

<style scoped>
/* 基础样式 */
.naive-button-override {

  /* font-weight: bold; */
  height: 1.8rem;
}


/* 默认按钮样式 - 当没有设置 type 时 */
.naive-button-override:not([type]) {
  background: var(--muted);
  color: var(--secondary);
  border-color: var(--border);
}

.naive-button-override:not([type]):hover {
  background: var(--muted-foreground);
  color: var(--muted);
}

/* 圆角按钮 */
.naive-button-override.round {
  border-radius: 0.25rem;
}

/* 圆形按钮 */
.naive-button-override.circle {
  border-radius: 50% !important;
  width: 1.8rem;
}

/* 禁用状态 */
.naive-button-override:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载状态 */
.naive-button-override.loading {
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
