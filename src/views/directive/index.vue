<template>
  <div class="card content-box">
    <Card>
      <template #title>复制指令</template>
      <n-space>
        <n-input placeholder="输入内容试试" v-model:value="data" style="width: 350px" />
        <n-button v-copy="data" type="primary" @click="a">复 制</n-button>
      </n-space>
    </Card>
    <Card class="mt-3">
      <template #title>防抖指令</template>
      <Button type="primary" v-debounce="b">防抖测试</Button>
    </Card>
    <Card class="mt-3">
      <template #title>节流指令</template>
      <Button type="primary" v-throttle="c">节流测试</Button>
    </Card>

    <Card class="mt-3">
      <template #title>拖拽指令</template>
      鼠标放到矩形上面拖拽试试 
    </Card>
    <div class="box" v-draggable> </div>
  </div>
</template>

<script setup lang="ts" name="copyDirect">
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { Card } from '@/components/Card';
  import { Button } from '@/components/Button';
  const data = ref<string>();
  const message = useMessage();
  const a = () => {
    message.success('复制成功:' + data.value);
  };
  const b = () => {
    message.success('防抖');
    console.log(data.value);
  };
  const c = () => {
    message.success('节流');
    console.log(data.value);
  };
</script>

<style scoped lang="less">
  body {
    width: 100px;
    height: 100px;
    background-color: #ccc;
    position: relative;
  }
  .content-box {
    height: 100vh;
    .box {
      width: 100px;
      height: 100px;
      background-color: #2d8cf0;
      position: absolute;
      z-index: 10000000;
      border-radius: 10px;
      margin: 20px 5px;
    }
  }
</style>
