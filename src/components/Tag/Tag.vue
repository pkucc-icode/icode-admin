<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { getCSSVariable } from '@/utils/cssUtil';

// 可以传入type，也可以直接传入color，组件会自动选择合适的字体颜色
interface TagProps {
  type?: 'default' | 'success' | 'info' | 'warning' | 'error'
  color?: string // 自定义颜色
}

const props = defineProps<TagProps>()
const designStore = useDesignSettingStore()

// 内置状态颜色（light 模式基色）
const presetMap = {
  success: '#4FBE97',
  info: '#2176AB',
  warning: '#DEb05A',
  error: '#BD1714'
} as const

// 缓存解析结果，避免重复计算
const colorCache = ref<Record<string, { r: number; g: number; b: number } | null>>({})

// 预编译正则表达式，避免重复创建
const VAR_REGEX = /var\(--([^)]+)\)/
const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const RGB_REGEX = /^rgba?\(([^)]+)\)$/

/** 工具函数：解析 hex/rgb 字符串为 RGB 对象（带缓存） */
function parseColorToRgb(color: string): { r: number; g: number; b: number } | null {
  if (!color) return null
  
  // 检查缓存
  if (colorCache.value[color]) {
    return colorCache.value[color]
  }
  
  let result: { r: number; g: number; b: number } | null = null
  
  // 处理 CSS 变量
  if (color.startsWith('var(')) {
    const varName = color.match(VAR_REGEX)?.[1]
    if (varName) {
      const actualColor = getCSSVariable(`--${varName}`)
      if (actualColor) {
        result = parseColorToRgb(actualColor)
      }
    }
  } else {
    const hexMatch = color.trim().match(HEX_REGEX)
    if (hexMatch) {
      let hex = hexMatch[1]
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
      }
      const num = parseInt(hex, 16)
      result = { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
    } else {
      const rgbMatch = color.trim().match(RGB_REGEX)
      if (rgbMatch) {
        const parts = rgbMatch[1].split(',').map(v => Number(v.trim()))
        if (parts.length >= 3) {
          result = { r: parts[0], g: parts[1], b: parts[2] }
        }
      }
    }
  }
  
  // 缓存结果
  colorCache.value[color] = result
  return result
}

/** 工具函数：计算相对亮度 (WCAG 定义) */
function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

/** 根据背景色自动选择黑或白文字 */
function autoTextColor(bg: string): string {
  const rgb = parseColorToRgb(bg)
  if (!rgb) return 'white'
  const luminance = getRelativeLuminance(rgb)
  return luminance > 0.5 ? 'black' : 'white'
}

// 自动计算变暗的颜色
function darkenColor(color: string, factor: number = 0.6): string {
  const rgb = parseColorToRgb(color)
  if (!rgb) return color
  
  return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`
}

const chosenColor = computed(() => {
  let baseColor: string | undefined
  
  if (props.color) {
    baseColor = props.color
  } else if (props.type === 'default') {
    baseColor = 'var(--primary)'
  } else if (props.type && props.type in presetMap) {
    baseColor = presetMap[props.type]
  }
  
  if (!baseColor) return undefined
  
  // dark 模式下自动变暗
  if (designStore.darkTheme) {
    return darkenColor(baseColor, 0.6)
  }
  
  return baseColor
})

const tagStyle = computed(() => {
  if (!chosenColor.value) {
    return { borderRadius: '0.4rem' }
  }
  return {
    backgroundColor: chosenColor.value,
    color: autoTextColor(chosenColor.value),
    borderRadius: '0.4rem'
  }
})
</script>

<template>
  <n-tag
    v-bind="$attrs"
    :bordered="false"
    class="text-xs px-2 h-6 border-transparent rounded-md border-0"
    :style="tagStyle"
  >
    <slot />
  </n-tag>
</template>

