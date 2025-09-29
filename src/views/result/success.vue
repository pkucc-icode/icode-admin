<template>
  <div class="result-box">
    <n-result
      status="success"
      title="操作成功"
      description="提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，灰色区域可以显示一些补充的信息。"
    >
      <div class="result-box-extra">
        <p>已提交申请，等待财务部门审核。</p>
      </div>
      <template #footer>
        <div class="flex justify-center mb-4">
          <n-space align="center">
            <Button type="info" @click="goHome">回到首页</Button>
            <Button>查看详情</Button>
            <Button>打印</Button>
          </n-space>
        </div>
      </template>
    </n-result>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useThemeVars } from 'naive-ui';
  import { Button } from '@/components/Button';

  const router = useRouter();
  const themeVars = useThemeVars();

  const getTableHeaderColor = computed(() => {
    return themeVars.value.tableHeaderColor;
  });

  function goHome() {
    router.push('/');
  }
</script>
<style lang="less" scoped>
  .result-box {
    width: 72%;
    height: 100%;
    margin: 0 auto;
    text-align: center;
    padding-top: 2rem;

    &-extra {
      padding: 24px 40px;
      text-align: left;
      background: v-bind(getTableHeaderColor);
      border-radius: 4px;
    }
  }
</style>
