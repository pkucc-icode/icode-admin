<template>
  <div class="result-box">
    <n-result
      status="info"
      title="提示"
      description="本次提交，将在24小时候内自动转入对方账户，如操作失误，请及时撤回"
    >
      <div class="result-box-extra">
        <p>您提交的内容如下：</p>
        <p class="mt-3">
          <n-space align="center">
            <n-icon size="20" color="#18a058">
              <CheckCircleOutlined />
            </n-icon>
            <span>转入支付宝账户（189****5426）：￥1980元</span>
            <Button type="info" text>立即撤回</Button>
          </n-space>
        </p>
        <p class="mt-3">
          <n-space>
            <n-icon size="20" color="#18a058">
              <CheckCircleOutlined />
            </n-icon>
            <span>转入支付宝账户（187****5426）：￥2980元</span>
            <Button type="info" text>立即撤回</Button>
          </n-space>
        </p>
      </div>
      <template #footer>
        <div class="flex justify-center mb-4">
          <n-space align="center">
            <Button type="info" @click="goHome">回到首页</Button>
            <Button>查看详情</Button>
            <Button>全部撤回</Button>
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
  import { CheckCircleOutlined } from '@vicons/antd';
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
