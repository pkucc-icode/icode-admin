<template>
  <Card>
    <template #title>个人设置</template>
    <n-tabs
      type="bar"
      animated
      placement="left"
    >
      <n-tab-pane v-for="tab in typeTabList" :name="tab.name" :tab="tab.name"> 
        <component :is="tab.component" />     
      </n-tab-pane>
    </n-tabs>
  </Card>
</template>
<script lang="ts" setup>
import { Card } from '@/components/Card';
import BasicSetting from './BasicSetting.vue';
import SafetySetting from './SafetySetting.vue';

const typeTabList = [
  {
    name: '基本设置',
    desc: '个人账户信息设置',
    key: 1,
    component: BasicSetting
  },
  {
    name: '安全设置',
    desc: '密码，邮箱等设置',
    key: 2,
    component: SafetySetting
  },
];

</script>
<style lang="less" scoped>
.thing-cell {
  margin: 0 -16px 10px;
  padding: 5px 16px;

  &:hover {
    background: #f3f3f3;
    cursor: pointer;
  }
}

.thing-cell-on {
  background: var(--muted);
  color: var(--primary);

  ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
    color: var(--primary);
  }

  &:hover {
    background: var(--muted);
  }
}
</style>
