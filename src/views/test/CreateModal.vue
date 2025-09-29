<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'NInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
      rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }],
    },
    {
      field: 'address',
      component: 'NInput',
      label: '地址',
      componentProps: {
        placeholder: '请输入地址',
      },
    },
    {
      field: 'date',
      component: 'NDatePicker',
      label: '日期',
      componentProps: {},
    },
  ];
  
  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新建',
    subBtuText: '保存',
  });

  const [registerForm, { submit }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      closeModal();
      console.log('formRes', formRes);
    } else {
      setSubLoading(false);
    }
  }

  defineExpose({
    openModal,
  });
</script>
