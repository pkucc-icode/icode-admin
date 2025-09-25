<template>
  <div class="grid grid-cols-2 gap-4 mb-4">
    <Card show-header>
      <template #header>
        测试卡片1
      </template>
      <n-button-group>
        <Button ghost :icon="CashIcon">再吃</Button>
        <Button ghost :icon="CashIcon">一颗</Button>
        <Button round :icon="CashIcon">苹果</Button>
      </n-button-group>
    </Card>
    <Card show-header>
      <template #header>
        测试卡片2
      </template>
      asuihui
      <n-space>
        <Button>Default</Button>
        <Button type="tertiary">
          Tertiary
        </Button>
        <Button type="primary">
          Primary
        </Button>
        <Button type="info">
          Info
        </Button>
        <Button type="success">
          Success
        </Button>
        <Button type="warning">
          Warning
        </Button>
        <Button type="error">
          Error
        </Button>
      </n-space>
      <n-space>
        <Button strong secondary>
          Default
        </Button>
        <Button strong secondary type="tertiary">
          Tertiary
        </Button>
        <Button strong secondary type="primary">
          Primary
        </Button>
        <Button strong secondary type="info">
          Info
        </Button>
        <Button strong secondary type="success">
          Success
        </Button>
        <Button strong secondary type="warning">
          Warning
        </Button>
        <Button strong secondary type="error">
          Error
        </Button>
        <Button strong secondary round>
          Default
        </Button>
        <Button strong secondary round type="primary">
          Primary
        </Button>
        <Button strong secondary round type="info">
          Info
        </Button>
        <Button strong secondary round type="success">
          Success
        </Button>
        <Button strong secondary round type="warning">
          Warning
        </Button>
        <Button strong secondary round type="error">
          Error
        </Button>
        <Button strong secondary circle :icon="CashIcon"></Button>
        <Button strong secondary circle type="tertiary" :icon="CashIcon"></Button>
        <Button strong secondary circle type="primary" :icon="CashIcon"></Button>
        <Button strong secondary circle type="info" :icon="CashIcon"></Button>
        <Button strong secondary circle type="success" :icon="CashIcon"></Button>
        <Button strong secondary circle type="warning" :icon="CashIcon"></Button>
        <Button strong secondary circle type="error" :icon="CashIcon"></Button>
      </n-space>

      <n-space>
    <Button tertiary>
      Default
    </Button>
    <Button tertiary type="primary">
      Primary
    </Button>
    <Button tertiary type="info">
      Info
    </Button>
    <Button tertiary type="success">
      Success
    </Button>
    <Button tertiary type="warning">
      Warning
    </Button>
    <Button tertiary type="error">
      Error
    </Button>
    </n-space>
    <n-space>
      <Button quaternary>
        Default
      </Button>
      <Button quaternary type="primary">
        Primary
      </Button>
      <Button quaternary type="info">
        Info
      </Button>
      <Button quaternary type="success">
        Success
      </Button>
      <Button quaternary type="warning">
        Warning
      </Button>
      <Button quaternary type="error">
        Error
      </Button>
    </n-space>
     <n-space>
    <Button ghost>
      Default
    </Button>
    <Button type="primary" ghost>
      Primary
    </Button>
    <Button type="info" ghost>
      Info
    </Button>
    <Button type="success" ghost>
      Success
    </Button>
    <Button type="warning" ghost>
      Warning
    </Button>
    <Button type="error" ghost>
      Error
    </Button>
  </n-space>
    </Card>
  </div>
  <Card class="mb-4">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
    />    
  </Card>
</template>

<script lang="ts" setup>
  import { Card } from '@/components/Card';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './basicColumns';
  import { ref, reactive, h } from 'vue';
  import { DeleteOutlined, EditOutlined } from '@vicons/antd';
  import { useDialog, useMessage } from 'naive-ui';
  import { getTableList } from '@/api/table/list';
  import { Button } from '@/components/Button';
  import { CashOutline as CashIcon } from '@vicons/ionicons5'
  const message = useMessage();
  const dialog = useDialog();
  const actionRef = ref();

  const params = reactive({
    pageSize: 5,
    name: 'NaiveAdmin',
  });

  const loadDataTable = async (res) => {
    return await getTableList({ ...params, ...res });
  };

  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: createActions(record),
      });
    },
  });

  function createActions(record) {
    return [
      {
        label: '删除',
        type: 'error',
        round: true,
        size: 'small',
        // 配置 color 会覆盖 type
        icon: DeleteOutlined,
        onClick: handleDelete.bind(null, record),
        // 根据权限控制是否显示: 有权限，会显示，支持多个
        auth: ['basic_list'],
      },
      {
        label: '编辑',
        type: 'info',
        round: true,
        size: 'small',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        auth: ['basic_list'],
      },
    ];
  }

  // 选中行
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function handleDelete(record) {
    console.log(record);
    dialog.info({
      title: '提示',
      content: `您想删除${record.name}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        message.success('删除成功');
      },
      onNegativeClick: () => {},
    });
  }

  function handleEdit(record) {
    console.log(record);
    message.success('您点击了编辑按钮');
  }
</script>

<style lang="less" scoped></style>
