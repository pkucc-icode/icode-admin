<template>
  <basicModal @register="modalRegister" ref="modalRef">
    <div class="py-3 menu-list">
        <n-tree
          block-line
          cascade
          checkable
          :virtual-scroll="true"
          :data="treeData"
          :expandedKeys="expandedKeys"
          :checked-keys="checkedKeys"
          style="max-height: 950px; overflow: hidden"
          @update:checked-keys="checkedTree"
          @update:expanded-keys="onExpandedKeys"
        />
      </div>
      <template #action>
        <n-space>
          <Button type="primary" ghost @click="packHandle">
            全部{{ expandedKeys.length ? '收起' : '展开' }}
          </Button>

          <Button type="primary" ghost @click="checkedAllHandle">
            全部{{ checkedAll ? '取消' : '选择' }}
          </Button>
          <Button type="primary" :loading="formBtnLoading" @click="okModal">提交</Button>
        </n-space>
      </template>
  </basicModal>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { basicModal, useModal } from '@/components/Modal';
  import { getMenuList, ListDate } from '@/api/system/menu';
  import { getTreeAll } from '@/utils';
  import { Button } from '@/components/Button';

  const treeData = ref<ListDate[]>([]);
  const expandedKeys = ref<string[]>([]);
  const checkedKeys = ref<string[]>(['console', 'step-form']);
  const checkedAll = ref(false);
  const formBtnLoading = ref(false);
  const message = useMessage();
  
  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '设置菜单权限',
    subBtuText: '保存',
  });

  function showModal(record: any) {
    openModal();
    nextTick(() => {
      if (record) checkedKeys.value = record.menu_keys;
    });
  }

  function okModal(e: any) {
    e.preventDefault();
    formBtnLoading.value = true;
    setTimeout(() => {
      closeModal();
      message.success('提交成功');
    //   reloadTable();
      formBtnLoading.value = false;
    }, 200);
  }


  function checkedTree(keys) {
    checkedKeys.value = [checkedKeys.value, ...keys];
  }

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = treeData.value.map((item: any) => item.key) as [];
    }
  }

  function checkedAllHandle() {
    if (!checkedAll.value) {
      checkedKeys.value = getTreeAll(treeData.value);
      checkedAll.value = true;
    } else {
      checkedKeys.value = [];
      checkedAll.value = false;
    }
  }

  onMounted(async () => {
    const treeMenuList = await getMenuList();
    expandedKeys.value = treeMenuList?.list.map((item) => item.key);
    treeData.value = treeMenuList?.list;
  });

  defineExpose({
    showModal,
  });
</script>
