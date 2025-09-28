<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <template v-if="props.title">
        <div class="table-toolbar-left-title">
          {{ props.title }}
          <n-tooltip trigger="hover" v-if="props.titleTooltip">
            <template #trigger>
              <n-icon size="18" class="ml-1 text-gray-400 cursor-pointer">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            {{ props.titleTooltip }}
          </n-tooltip>
        </div>
      </template>
      <slot name="tableTitle"></slot>
    </div>

    <div class="flex items-center leading-none table-toolbar-right">
      <slot name="toolbar"></slot>

      <!--斑马纹-->
      <!-- <n-tooltip trigger="hover">
        <template #trigger>
          <div class="mr-2 table-toolbar-right-icon">
            <n-switch v-model:value="isStriped" @update:value="setStriped" />
          </div>
        </template>
        <span>表格斑马纹</span>
      </n-tooltip>
      <n-divider vertical /> -->

      <!--刷新-->
      <!-- <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon" @click="reload">
            <n-icon size="18">
              <ReloadOutlined />
            </n-icon>
          </div>
        </template>
        <span>刷新</span>
      </n-tooltip> -->

      <!--密度-->
      <!-- <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon">
            <n-dropdown
              @select="densitySelect"
              trigger="click"
              :options="densityOptions"
              v-model:value="tableSize"
            >
              <n-icon size="18">
                <ColumnHeightOutlined />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>密度</span>
      </n-tooltip> -->

      <!--表格设置单独抽离成组件-->
      <ColumnSetting />
    </div> 
  </div>
  <div class="s-table">
    <n-data-table
      ref="tableElRef"
      v-bind="getBindValues"
      :striped="false"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
      bordered
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </n-data-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, toRaw, computed, onMounted, nextTick } from 'vue';
  import { QuestionCircleOutlined } from '@vicons/antd';
  import { createTableContext } from './hooks/useTableContext';

  import ColumnSetting from './components/settings/ColumnSetting.vue';

  import { useLoading } from './hooks/useLoading';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { usePagination } from './hooks/usePagination';

  import { basicProps } from './props';

  import { BasicTableProps } from './types/table';

  import { getViewportOffset } from '@/utils/domUtils';
  import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';
  import { isBoolean } from '@/utils/is';

  // const densityOptions = [
  //   { type: 'menu', label: '紧凑', key: 'small' },
  //   { type: 'menu', label: '默认', key: 'medium' },
  //   { type: 'menu', label: '宽松', key: 'large' },
  // ];

  const emit = defineEmits([
    'fetch-success',
    'fetch-error',
    'update:checked-row-keys',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change',
  ]);

  const props = defineProps({ ...basicProps });
  const deviceHeight = ref(150);
  const tableElRef = ref<ComponentRef>(null);
  const wrapRef = ref<Nullable<HTMLDivElement>>(null);
  let paginationEl: HTMLElement | null;
  // const isStriped = ref(props.striped || false);
  const tableData = ref<Recordable[]>([]);
  const innerPropsRef = ref<Partial<BasicTableProps>>();

  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
  });

  const tableSize = ref(unref(getProps as any).size || 'medium');

  const { getLoading, setLoading } = useLoading(getProps);

  const { getPaginationInfo, setPagination } = usePagination(getProps);

  const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(
    getProps,
    {
      getPaginationInfo,
      setPagination,
      tableData,
      setLoading,
    },
    emit
  );

  const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } =
    useColumns(getProps);

  //页码切换
  function updatePage(page) {
    setPagination({ page: page });
    reload();
  }

  //分页数量切换
  function updatePageSize(size) {
    setPagination({ page: 1, pageSize: size });
    reload();
  }

  //密度切换
  // function densitySelect(e) {
  //   tableSize.value = e;
  // }

  //获取表格大小
  const getTableSize = computed(() => tableSize.value);

  //组装表格信息
  const getBindValues = computed(() => {
    const tableData = unref(getDataSourceRef);
    // const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';
    
    return {
      ...unref(getProps),
      loading: unref(getLoading),
      columns: toRaw(unref(getPageColumns)),
      rowKey: unref(getRowKey),
      data: tableData,
      size: unref(getTableSize),
      remote: true,
      // 'max-height': maxHeight,
      title: '', // 重置为空 避免绑定到 table 上面
    };
  });

  //获取分页信息
  const pagination = computed(() => toRaw(unref(getPaginationInfo)));

  function setProps(props: Partial<BasicTableProps>) {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props };
  }

  // const setStriped = (value: boolean) => (isStriped.value = value);

  const tableAction = {
    reload,
    setColumns,
    setLoading,
    setProps,
    getColumns,
    getDataSource,
    getPageColumns,
    getCacheColumns,
    setCacheColumnsField,
    emit,
  };

  const getCanResize = computed(() => {
    const { canResize } = unref(getProps);
    return canResize;
  });

  async function computeTableHeight() {
    const table = unref(tableElRef);
    if (!table) return;
    if (!unref(getCanResize)) return;
    const tableEl: any = table?.$el;
    const headEl = tableEl.querySelector('.n-data-table-thead ');
    const { bottomIncludeBody } = getViewportOffset(headEl);
    const headerH = 64;
    let paginationH = 2;
    let marginH = 24;
    if (!isBoolean(unref(pagination))) {
      paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationH += offsetHeight || 0;
      } else {
        paginationH += 28;
      }
    }
    let height =
      bottomIncludeBody - (headerH + paginationH + marginH + (props.resizeHeightOffset || 0));
    const maxHeight = props.maxHeight;
    height = maxHeight && maxHeight < height ? maxHeight : height;
    deviceHeight.value = height;
  }

  useWindowSizeFn(computeTableHeight, 280);

  onMounted(() => {
    nextTick(() => {
      computeTableHeight();
    });
  });

  createTableContext({ ...tableAction, wrapRef, getBindValues });

  defineExpose(tableAction);
</script>
<style lang="less" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    // padding: 0 0 16px 0;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 600;
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      flex: 1;

      &-icon {
        margin-left: 12px;
        font-size: 16px;
        cursor: pointer;
        color: var(--text-color);

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }

/* NDataTable style hooks - override freely where needed */
:deep(.n-data-table) {

  .n-data-table-wrapper{
    border-top-color: transparent !important;  
    border-left-color: transparent !important; 
    border-right-color: transparent !important;
    border-bottom-color: var(--decoration) !important;     
  }
  
  .n-data-table-table {
    background-color: transparent;
  }

  /* header */
  .n-data-table-thead {
    .n-data-table-th { 
      background: var(--secondary);
      border-bottom: none; 

      .n-data-table-resize-button::after {
        background-color: var(--decoration);
      }
    }
    .n-data-table-th--sortable:hover{
      background: var(--secondary);
    }
    .n-data-table-th__title { 
      color: var(--secondary-foreground);
      font-size: 1rem;
      font-weight: bold;
    }

    .n-base-icon > i,
    .n-base-icon > svg {
      display: none !important;
    }
    .n-base-icon::before {
      content: '' !important;
      display: inline-block !important;
      transform: translateY(-0.05rem);
      border-left: 0.45rem solid transparent;
      border-right: 0.45rem solid transparent;
      border-top: 0.55rem solid currentColor; 
    }
  }

  .n-data-table-tbody {
    /* 表体格子 */
    .n-data-table-td { 
      border-bottom-color: var(--decoration); 
      color: var(--text);
      font-weight: 500;
    }

    /* 表体行hover状态 */
    .n-data-table-tr:hover, .n-data-table-tr:hover > .n-data-table-td { 
      background-color: var(--secondary) !important;
    }

    /* 可排序的表头 */
    .n-data-table-td, .n-data-table-td.n-data-table-td--sorting {
      background-color: transparent;
    } 

    /* 右侧固定的单元格 */
    .n-data-table-td--fixed-right {
      background-color: var(--secondary) !important;
    }    
  }
  
  /* title area */
  .n-data-table-title { 
    /* table title wrapper */ 
    border-bottom-color: inherit; 
  }


  /* pagination */
  .n-data-table__pagination { 
    /* pagination wrapper */ 
    color: inherit; 
  }
}

:deep(.n-pagination) {
  .n-pagination-item {
    color: var(--text);
    background-color: var(--secondary);
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
  }

  .n-pagination-item:not(.n-pagination-item--disabled):hover {
    // border-color: var(--primary);
    background-color: var(--muted);
    // color: var(--muted-foreground);
  }

  .n-pagination-item--active, .n-pagination-item--button {
    color: var(--primary-foreground) !important;
    background-color: var(--primary) !important;
  }

  // .n-pagination-quick-jumper {
  //   .n-input-wrapper {
  //     background-color: var(--secondary);
  //     border: none;
  //     color: var(--secondary-foreground);
  //     outline: none;
  //   }
  // }
}
</style>
