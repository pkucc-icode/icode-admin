<template>
  <div class="flex flex-col justify-center page-container">
    <div class="text-center">
      <img src="~@/assets/images/exception/500.svg" alt="" />
    </div>
    <div class="text-center">
      <h1 class="text-base text-gray-500">抱歉，服务器出错了</h1>
      <Button type="info" @click="goHome">回到首页</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Button } from '@/components/Button';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function goHome() {
    router.push('/');
  }
</script>

<style lang="less" scoped>
  .page-container {
    width: 100%;
    min-height: calc(100vh - 220px);
    height: 100%;
    padding: 20px 0;

    .text-center {
      h1 {
        color: #666;
        padding: 20px 0;
      }
    }

    img {
      width: 350px;
      max-width: 90%;
      margin: 0 auto;
    }
  }
</style>
