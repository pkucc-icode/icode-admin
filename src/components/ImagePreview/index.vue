<template>
  <!-- 全屏遮罩层 -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="w-full h-full flex items-center justify-center relative">
          <div 
            class="w-full h-full flex items-center justify-center"
            ref="containerRef"
            @mousedown="startDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @mousemove="handleMouseMove"
          >
            <img
              :src="currentImage"
              class="max-w-full max-h-full object-contain select-none"
              :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
              ref="imageRef"
              @wheel.prevent="handleWheel"
              draggable="false"
              :style="{
                transform: `scale(${transform.scale}) translate(${transform.position.x}px, ${transform.position.y}px)`
              }"
            />
          </div>
        </div>
        
        <!-- 大小提示显示 -->
        <Transition
          enter-active-class="transition-opacity duration-200"
          leave-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="showZoomPercentage"
            class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <span class="text-lg text-white bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
              {{ Math.round(transform.scale * 100) }}%
            </span>
          </div>
        </Transition>

        <!-- 大小切换控件 -->
        <div 
          class="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex gap-3 transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': !showBottomControls, 'opacity-100': showBottomControls }"
        >
          <n-button 
            circle
            type="primary"
            size="small"
            secondary
            @click="zoomOut"
            title="缩小 (-)"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,13H5V11H19V13Z" />
                </svg>
              </n-icon>
            </template>
          </n-button>
          <n-button 
            circle
            type="primary"
            size="small"
            secondary
            @click="resetImageTransform"
            title="重置 (0)"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z" />
                </svg>
              </n-icon>
            </template>
          </n-button>
          <n-button 
            circle
            type="primary"
            size="small"
            secondary
            @click="zoomIn"
            title="放大 (+)"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
              </n-icon>
            </template>
          </n-button>
        </div>

        <!-- 显示当前图片索引 -->
        <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <span class="text-white text-sm bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
        </div>

        <!-- 上一张 -->
        <div 
          v-if="images.length > 1"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': !showPrevButton, 'opacity-100': showPrevButton }"
        >
          <n-button 
            circle
            type="primary"
            secondary
            @click="prevImage"
            :disabled="currentIndex <= 0"
            title="上一张 (←)"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                </svg>
              </n-icon>
            </template>
          </n-button>
        </div>

        <!-- 下一张 -->
        <div 
          v-if="images.length > 1"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': !showNextButton, 'opacity-100': showNextButton }"
        >
          <n-button 
            circle
            type="primary"
            secondary
            @click="nextImage"
            :disabled="currentIndex >= images.length - 1"
            title="下一张 (→)"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </n-icon>
            </template>
          </n-button>
        </div>
        
        <!-- 关闭按钮 -->
        <div 
          class="absolute top-4 right-4 z-10 transition-opacity duration-300"
        >
          <n-button 
            circle
            type="primary"
            size="small"
            secondary
            @click="close"
            title="关闭 (Esc)"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue';

interface ImagePreviewProps {
  modelValue: boolean;
  images: string[];
  initialIndex?: number;
}

interface ImagePreviewEmits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  initialIndex: 0
});

const emit = defineEmits<ImagePreviewEmits>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const currentIndex = ref(props.initialIndex);
const currentImage = computed(() => props.images[currentIndex.value]);
const showZoomPercentage = ref(false);
const percentageTimeout = ref<number | null>(null);
const imageRef = ref<any>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const showPrevButton = ref(false);
const showNextButton = ref(false);
const showBottomControls = ref(false);
// const showCloseButton = ref(false);

const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const startPosition = ref({ x: 0, y: 0 });

const transform = reactive({
  scale: 1,
  position: { x: 0, y: 0 }
});

const edgeDetectionTimeout = ref<number | null>(null);
const controlsTimeout = ref<number | null>(null);

watch(visible, (newVal) => {
  if (newVal) {
    currentIndex.value = props.initialIndex;
    resetImageTransform();
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
    clearAllTimeouts();
    hideAllControls();
  }
});

watch(currentIndex, () => {
  resetImageTransform();
});

onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  clearAllTimeouts();
});

const clearAllTimeouts = () => {
  if (percentageTimeout.value) {
    clearTimeout(percentageTimeout.value);
    percentageTimeout.value = null;
  }
  if (edgeDetectionTimeout.value) {
    clearTimeout(edgeDetectionTimeout.value);
    edgeDetectionTimeout.value = null;
  }
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value);
    controlsTimeout.value = null;
  }
};

const hideAllControls = () => {
  showPrevButton.value = false;
  showNextButton.value = false;
  showBottomControls.value = false;
  // showCloseButton.value = false;
};

const detectMousePosition = (e: MouseEvent) => {
  const container = containerRef.value;
  if (!container) return;
  
  const containerRect = container.getBoundingClientRect();
  const x = e.clientX - containerRect.left;
  const y = e.clientY - containerRect.top;
  const width = containerRect.width;
  const height = containerRect.height;
  
  showPrevButton.value = x < 100;
  
  showNextButton.value = x > width - 100;
  
  showBottomControls.value = y > height - 100;
  
  // showCloseButton.value = x > width - 100 && y < 100;
  
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value);
  }
  
  controlsTimeout.value = window.setTimeout(() => {
    if (!(showPrevButton.value || showNextButton.value || showBottomControls.value || showCloseButton.value)) {
      hideAllControls();
    }
  }, 1000);
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const close = () => {
  visible.value = false;
};

const showPercentageTemporarily = () => {
  showZoomPercentage.value = true;
  
  if (percentageTimeout.value) {
    clearTimeout(percentageTimeout.value);
  }
  
  percentageTimeout.value = window.setTimeout(() => {
    showZoomPercentage.value = false;
    percentageTimeout.value = null;
  }, 1000);
};

const zoomIn = () => {
  transform.scale = Math.min(transform.scale + 0.1, 2); // Max 200%
  showPercentageTemporarily();
};

const zoomOut = () => {
  transform.scale = Math.max(transform.scale - 0.1, 0.5); // Min 5%
  showPercentageTemporarily();
};

// const resetZoom = () => {
//   transform.scale = 1;
//   showPercentageTemporarily();
// };

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = { x: e.clientX, y: e.clientY };
  startPosition.value = { ...transform.position };
  
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  
  const dx = (e.clientX - dragStart.value.x) / transform.scale;
  const dy = (e.clientY - dragStart.value.y) / transform.scale;
  
  transform.position = {
    x: startPosition.value.x + dx,
    y: startPosition.value.y + dy
  };
};

const endDrag = () => {
  isDragging.value = false;
};

const handleMouseMove = (e: MouseEvent) => {
  onDrag(e);
  detectMousePosition(e);
};

// const resetPosition = () => {
//   transform.position = { x: 0, y: 0 };
// };

const resetImageTransform = () => {
  transform.scale = 1;
  transform.position = { x: 0, y: 0 };
};

watch(transform, () => {
  updateImageTransform();
}, { deep: true });

const updateImageTransform = () => {
  // 原生 img 元素，transform 直接通过 :style 绑定，不需要手动更新
};

// 键盘事件支持
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      close();
      break;
    case 'ArrowLeft':
      prevImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
    case '+':
    case '=':
      zoomIn();
      break;
    case '-':
    case '_':
      zoomOut();
      break;
    case '0':
      resetImageTransform();
      break;
  }
};
</script>

<style scoped>
/* 所有样式已通过 Tailwind CSS 实现，无需额外样式 */
</style>