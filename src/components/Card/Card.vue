<script setup lang='ts'>
import { computed, useSlots } from 'vue'
import Card from './src/Card.vue'
import CardContent from './src/CardContent.vue';
// import CardDescription from './src/CardDescription.vue';
import CardFooter from './src/CardFooter.vue';
import CardHeader from './src/CardHeader.vue';
// import CardTitle from './src/CardTitle.vue';

interface Props {
  // When undefined, auto: render only if slot content exists
  showHeader?: boolean
  showFooter?: boolean
}

const props = defineProps<Props>()
const slots = useSlots()

const renderHeader = computed(() =>
  props.showHeader !== undefined
    ? props.showHeader
    : !!(slots.header || slots.title || slots.description)
)

const renderFooter = computed(() =>
  props.showFooter !== undefined ? props.showFooter : !!slots.footer
)
</script>

<template>
  <Card class="glass-card">
    <CardHeader v-if="renderHeader" style="color: var(--foreground)">
      <slot name="header"></slot>
    </CardHeader>
    <CardContent :class="{'pt-6': !renderHeader}" style="color: var(--foreground)">
      <slot></slot>
    </CardContent>
    <CardFooter v-if="renderFooter" style="color: var(--foreground)">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>