<template>
  <NRow :gutter="24">
    <NCol :span="24">
      <Card>
        <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
          <n-tab-pane name="流量趋势">
            <FluxTrend />
          </n-tab-pane>
          <n-tab-pane name="访问量">
            <VisitAmount />
          </n-tab-pane>
        </n-tabs>
      </Card>
    </NCol>
  </NRow>
</template>
<script lang="ts" setup>
  import FluxTrend from './FluxTrend.vue';
  import VisitAmount from './VisitAmount.vue';
  import { Card } from '@/components/Card';
</script>
