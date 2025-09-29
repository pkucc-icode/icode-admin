<template>
  <div>
    <div class="n-layout-page-header">
      <Card>
        <template #title>角色权限管理</template>
        页面数据为 Mock 示例数据，非真实数据。
      </Card>
    </div>
    <Card>
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <Button type="primary" @click="addRole" :icon="PlusOutlined">
            新增角色
          </Button>
        </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </Card>
    <MenuModal  ref="menuModalRef" />
    <CreateModal ref="createModalRef" />
    <EditModal ref="editModalRef" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, h } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getRoleList } from '@/api/system/role';
  import { columns } from './columns';
  import { EditOutlined, PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import CreateModal from './CreateModal.vue';
  import EditModal from './EditModal.vue';
  import MenuModal from './MenuModal.vue';
  import { Card } from '@/components/Card';
  import { Button } from '@/components/Button';

  const message = useMessage();
  const actionRef = ref();
  const createModalRef = ref();
  const editModalRef = ref();
  const menuModalRef = ref();

  const params = reactive({
    name: 'NaiveAdmin',
  });

  const actionColumn = reactive({
    width: 290,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '菜单权限',
            type: 'primary',
            onClick: handleMenuAuth.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            type: 'info',
            icon: EditOutlined,
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['basic_list'],
          },
          {
            label: '删除',
            type: 'error',
            icon: DeleteOutlined,
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
        ],
      });
    },
  });

  const loadDataTable = async (res: any) => {
    let _params = {
      ...unref(params),
      ...res,
    };
    return await getRoleList(_params);
  };

  function addRole() {
    createModalRef.value.openModal();
  }

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  // function reloadTable() {
  //   actionRef.value.reload();
  // }


  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    // router.push({ name: 'basic-info', params: { id: record.id } });
    editModalRef.value.showModal(record);
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  function handleMenuAuth(record: Recordable) {
    menuModalRef.value.showModal(record);
  }

  
</script>

<style lang="less" scoped></style>
