<script setup lang="ts">
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { computed, nextTick, watch } from 'vue'

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

// 获取 CSS 变量值的函数
const getCSSVariableValue = (variableName: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim()
    return value
  }
  return ''
}

// 计算属性，使用 tailwind.css 中定义的 CSS 变量
const buttonProps = computed(() => {
  const { icon, ...rest } = props
  
  // 添加对 darkTheme 的依赖，确保主题切换时重新计算
  const _ = designStore.darkTheme
  
  // 如果没有手动传 color，根据 type 设置 tailwind.css 中的颜色
  if (!rest.color) {
    switch (rest.type) {
      case 'primary':
        rest.color = getCSSVariableValue('--primary')
        break
      case 'info':
        rest.color = getCSSVariableValue('--info')
        break
      case 'success':
        rest.color = getCSSVariableValue('--success')
        break
      case 'warning':
        rest.color = getCSSVariableValue('--warning')
        break
      case 'error':
        rest.color = getCSSVariableValue('--error')
        break
      default:
        // 默认按钮不设置 color，让 Naive UI 使用默认样式
        break
    }
  }
  
  return rest
})

// 计算按钮的 class
const buttonClass = computed(() => {
  const classes = ['naive-button-override']
  
  if (designStore.darkTheme) {
    classes.push('dark')
  }
  
  if (props.round) {
    classes.push('round')
  }
  
  if (props.circle) {
    classes.push('circle')
  }
  
  return classes.join(' ')
})

const designStore = useDesignSettingStore()

// 监听主题变化，确保切换时重新获取 CSS 变量值
watch(() => designStore.darkTheme, async () => {
  // 延迟一点时间确保 CSS 变量已经更新
  await nextTick();
}, { flush: 'post' })
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
