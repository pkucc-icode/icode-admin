<template>
  <div class="logo">
    <img :src="websiteConfig.logo" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="title" :class="{ 'dark': designStore.darkTheme }">{{ websiteConfig.title }}</h2>
  </div>
</template>

<script lang="ts">
  import { websiteConfig } from '@/config/website.config';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  export default {
    name: 'Index',
    props: {
      collapsed: {
        type: Boolean,
      },
    },
    data() {
      return {
        websiteConfig,
        designStore: useDesignSettingStore(),
      };
    },
  };
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96px;
    line-height: 96px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin: 0 8px;
      font-size: 24px;
      font-weight: bold;
      color: var(--accent);
    }
  }
</style>
