<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, onUpdated } from "vue";

  withDefaults(
    defineProps<{
      content?: string;
      type?: 'auto' | 'force'; // 'auto': 自动检测文本截断, 'force': 强制显示
    }>(),
    {
      content: "",
      type: 'auto',
    }
  );

  // 文本元素引用 & 状态
  const textRef = ref<HTMLElement>();
  const isEllipsis = ref(false);

  // 检测函数
  function checkEllipsis() {
    const el = textRef.value;
    if (!el) {
      isEllipsis.value = false;
      return;
    }
    // 单行截断判断
    isEllipsis.value = el.scrollWidth - el.clientWidth > 2;    
  }

  // 监听宽度或内容变化
  let ro: ResizeObserver | null = null;

  onMounted(() => {
    checkEllipsis();
    if (window.ResizeObserver) {
      ro = new ResizeObserver(checkEllipsis);
      textRef.value && ro.observe(textRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  });

  onUpdated(() => {
    checkEllipsis();
  });

</script>

<template>
  <n-tooltip 
    trigger="hover" 
    class="text-sm max-w-96 break-all rounded"
    :disabled="type === 'auto' && !isEllipsis"
  >
    <template #trigger>
      <p ref="textRef"
        v-bind="$attrs"
        :class="[
          'max-w-full overflow-hidden whitespace-nowrap truncate',
        ]">{{ content }}</p>  
    </template>
    <slot></slot>
  </n-tooltip>
</template>
