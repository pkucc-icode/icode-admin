<template>
  <div class="result-box">
    <n-result status="error" title="操作失败" description="请核对并修改以下信息后，再重新提交。">
      <div class="result-box-extra">
        <p>您提交的内容有如下错误：</p>
        <p class="mt-3">
          <n-space align="center">
            <n-icon size="20" color="#f0a020">
              <InfoCircleOutlined />
            </n-icon>
            <span>认证照片不够清晰</span>
            <Button type="info" text>立即修改</Button>
          </n-space>
        </p>
        <p class="mt-3">
          <n-space>
            <n-icon size="20" color="#f0a020">
              <InfoCircleOutlined />
            </n-icon>
            <span>备注包含敏感字符，并且不能包含政治相关</span>
            <Button type="info" text>立即修改</Button>
          </n-space>
        </p>
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
  import { useThemeVars } from 'naive-ui';
  import { useRouter } from 'vue-router';
  import { InfoCircleOutlined } from '@vicons/antd';
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
