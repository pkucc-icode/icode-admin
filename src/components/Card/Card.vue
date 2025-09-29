<script setup lang="ts">
import { useSlots, computed } from 'vue'
import Card from './src/Card.vue'
import CardContent from './src/CardContent.vue'
import CardFooter from './src/CardFooter.vue'
import CardTitle from './src/CardTitle.vue'
import CardDescription from './src/CardDescription.vue'
import CardHeader from './src/CardHeader.vue'

const slots = useSlots()


const renderHeader = computed(() => {
  if (slots.header) {
    return 'header'
  } else if (slots.title || slots.description) {
    return 'title-description'
  }
  return null
})

const renderFooter = computed(() => !!slots.footer)
</script>

<template>
  <Card class="my-4">
    <CardHeader v-if="renderHeader" style="color: var(--foreground)">
      <template v-if="renderHeader === 'header'">
        <slot name="header"></slot>
      </template>
      <template v-else>
        <CardTitle v-if="$slots.title">
          <slot name="title"></slot>
        </CardTitle>
        <CardDescription v-if="$slots.description">
          <slot name="description"></slot>
        </CardDescription>
      </template>
    </CardHeader>

    <CardContent :class="{ 'pt-6': !renderHeader }" style="color: var(--foreground)">
      <slot></slot>
    </CardContent>

    <CardFooter v-if="renderFooter" style="color: var(--foreground)">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>