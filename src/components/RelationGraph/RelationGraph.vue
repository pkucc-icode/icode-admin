<template>
  <div class="relation-graph-container">
    <n-empty description="无内容" v-show="!graphData.nodes.length"/>
    <div v-show="graphData.nodes.length" class="chart-wrapper">
      <div ref="chartContainer" class="w-full h-full rounded-lg"></div>
      <Button 
        class="fullscreen-btn" 
        size="small" 
        text
        @click="toggleFullscreen"
      >
        <n-icon>
          <FullscreenExitOutlined v-if="isFullscreen" />
          <FullscreenOutlined v-else />
        </n-icon>
        <!-- {{ isFullscreen ? '退出全屏' : '全屏' }} -->
      </Button>
    </div>

    <!-- 编辑节点弹窗 -->
    <basicModal
      ref="modalRef"
      @register="modalRegister"
      @on-ok="handleUpdate"
      @cancel="closeModal"
    >
      <n-input 
        v-model:value="editValue" 
        :placeholder="editType === 'node' ? '请输入节点名称' : '请输入关系类型'"
        @press-enter="handleEdit"
      />
    </basicModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { GraphData, NodeData, EdgeData } from './types';
import { Button } from '../Button';
import { FullscreenOutlined, FullscreenExitOutlined } from '@vicons/antd';
import { basicModal, useModal } from '../Modal';
import { getCSSVariable } from '@/utils/cssUtil';




const props = defineProps<{
  nodeMapping: Record<string, string>;
  graphData: GraphData;
}>();

const emit = defineEmits(['dataChange']);

// 获取主题状态
const designStore = useDesignSetting();
const isDark = computed(() => designStore.getDarkTheme);

const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const selectedElements = ref<string[]>([]);

// 全屏状态
const isFullscreen = ref(false);

// 编辑弹窗状态
const modalRef = ref();
const editType = ref<'node' | 'edge'>('node');
const editValue = ref('');
const editData = ref<any>(null);

const nodeTypeColors: Record<string, string> = {
  '人物': '#f59311', 
  '组织': '#0e72cc', 
  '地点': '#fa4343',
  '事件': '#16afcc',
  '概念': '#6ca30f' 
};


const [modalRegister, { openModal, closeModal, setProps }] = useModal({
  title: '编辑节点',
  subBtuText: '保存',
});

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;

  chartInstance = echarts.init(chartContainer.value);

  const getTypes =  () => Object.entries(props.nodeMapping).map(([name, color]) => ({
    name,
    itemStyle: { color }
  }))

  // 设置基础配置
  const option = {
    tooltip: {
      show: true,
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `<b>${params.data.category || '未知'}</b><br/>${params.data.name}`;
        } else if (params.dataType === 'edge') {
          return `${params.data.source}<br/><b>${params.data.name}</b><br/>${params.data.target}`;
        }
        return '';
      }
    },
    legend: {
      show: true,
      orient: 'vertical',
      left: 0,
      bottom: 0,
      data: getTypes(),
      textStyle: {
        color: getCSSVariable('--text'),
        fontSize: 12,
        fontWeight: 'bold'
      },
      itemGap: 8,
      padding: [10, 15]
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: [],
      links: [],
      categories: getTypes(),
      legendHoverLink: true,
      roam: true,
      draggable: true,
      focusNodeAdjacency: true,
      lineStyle: {
        color: '#6B7280',
        width: 2,
        curveness: 0.1
      },
      force: {
        repulsion: 1000,
        edgeLength: 100,
        layoutAnimation: true
      }
    }]
  };
  chartInstance.setOption(option);

  // 添加交互事件
  chartInstance.on('click', (params: any) => {
    if (params.dataType === 'node') {
      // 节点点击事件
      handleNodeClick(params.data);
    } else if (params.dataType === 'edge') {
      // 边点击事件
      handleEdgeClick(params.data);
    }
  });

  chartInstance.on('dblclick', (params: any) => {
    if (params.dataType === 'node') {
      // 双击节点编辑
      editNode(params.data);
    } else if (params.dataType === 'edge') {
      // 双击边编辑
      editEdge(params.data);
    }
  });
};

// 计算节点的连接数
const calculateNodeConnections = (data: GraphData) => {
  const connectionCount: Record<string, number> = {};
  
  // 初始化所有节点的连接数为0
  data.nodes.forEach(node => {
    connectionCount[node.id] = 0;
  });
  
  // 统计每个节点的连接数
  data.edges.forEach(edge => {
    connectionCount[edge.source]++;
    connectionCount[edge.target]++;
  });
  
  return connectionCount;
};

// 更新图表数据
const updateChart = (data: GraphData) => {
  if (!chartInstance) return;

  // 计算节点连接数
  const connectionCount = calculateNodeConnections(data);
  const maxConnections = Math.max(...Object.values(connectionCount));
  const minConnections = Math.min(...Object.values(connectionCount));
  
  // 转换节点数据
  const nodes = data.nodes.map((node: NodeData) => {
    const connections = Math.ceil(connectionCount[node.id]);
    
    // 根据连接数计算节点大小
    const baseSize = 50;
    const maxSize = 80;
    const sizeRange = maxSize - baseSize;
    const normalizedConnections = maxConnections > minConnections 
      ? (connections - minConnections) / (maxConnections - minConnections)
      : 0.5;
    const symbolSize = baseSize + (sizeRange * normalizedConnections);
    
    return {
      id: node.id,
      name: node.label,
      category: node.type || '未知',
      symbol: 'circle',
      symbolSize: symbolSize,
      itemStyle: {
        color:new echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
            offset: 0.1,
            color: isDark.value ? '#000000' : '#ffffff',
        }, {
            offset: 1,
            color: props.nodeMapping[node.type || ''] || '#9CA3AF'
        }]),
        // color: {
        //   type: 'radial',
        //   x: 0.5,
        //   y: 0.5,
        //   r: 0.8,
        //   colorStops: [
        //     { offset: 0, color: '#FFFFFF' }, // 中心亮
        //     // { offset: 0, color: props.nodeMapping[node.type || ''] || '#9CA3AF' }, // 中心
        //     { offset: 0.5, color: props.nodeMapping[node.type || ''] || '#9CA3AF' }, 
        //     { offset: 1, color: '#000000' } // 边缘
        //   ],
        //   global: false
        // },
        // color: props.nodeMapping[node.type || ''] || '#9CA3AF',

        // 节点阴影
        shadowBlur:  4,
        shadowColor: props.nodeMapping[node.type || ''] || '#9CA3AF',
        // shadowOffsetX: 1,
        // shadowOffsetY: 1,

        // 节点边框
        borderWidth: Math.ceil(symbolSize / 10),
        borderColor: props.nodeMapping[node.type || ''] || '#9CA3AF',

        opacity: 1,
      },
      label: {
        show: true,
        position: 'inside',
        fontSize: Math.max(10, Math.min(20, symbolSize / 6)), // 根据节点大小调整字体
        color: '#FFFFFF',
        // fontWeight: 'bold',
        textBorderColor: getCSSVariable('--text'),
        textBorderWidth: 4
      }
    };
  });

  // 转换边数据
  const links = data.edges.map((edge: EdgeData) => ({
    id: edge.id,
    name: edge.label,
    source: edge.source,
    target: edge.target,
    // label: edge.label,
    lineStyle: {
      color: getCSSVariable('--text'),
      width: 2,
      curveness: 0.1
    },
    label: {
      show: true,
      formatter: edge.label,
      fontSize: 12,
      color: '#ffffff',
      backgroundColor: getCSSVariable('--primary'),
      borderWidth: 1,
      borderRadius: 12,
      padding: [4, 8]
    }
  }));

  // 更新图表
  chartInstance.setOption({
    series: [{
      data: nodes,
      links: links
    }]
  });

  console.log(chartInstance.getOption());
  
};

// 处理节点点击
const handleNodeClick = (nodeData: any) => {
  selectedElements.value = [nodeData.id];
  // 可以添加更多交互逻辑
};

// 处理边点击
const handleEdgeClick = (edgeData: any) => {
  selectedElements.value = [edgeData.id];
  // 可以添加更多交互逻辑
};

// 编辑节点
const editNode = (nodeData: any) => {
  editType.value = 'node';
  editValue.value = nodeData.name;
  editData.value = nodeData;
  setProps({ title: '编辑节点' });
  modalRef.value.openModal();
};

// 编辑边
const editEdge = (edgeData: any) => {
  editType.value = 'edge';
  editValue.value = edgeData.name;
  editData.value = edgeData;
  setProps({ title: '编辑关系' });
  modalRef.value.openModal();
};

// 处理编辑确认
const handleEdit = () => {
  if (!editValue.value.trim()) return;
  
  if (editType.value === 'node') {
    const updatedData = {
      nodes: props.graphData.nodes.map(node => 
        node.id === editData.value.id ? { ...node, label: editValue.value } : node
      ),
      edges: props.graphData.edges
    };
    emit('dataChange', updatedData);
  } else {
    const updatedData = {
      nodes: props.graphData.nodes,
      edges: props.graphData.edges.map(edge => 
        edge.id === editData.value.id ? { ...edge, label: editValue.value } : edge
      )
    };
    emit('dataChange', updatedData);
  }
  
  modalRef.value.closeModal();
};

// 窗口大小变化时重新调整图表
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏
    const container = document.querySelector('.relation-graph-container') as HTMLElement;
    if (container && container.requestFullscreen) {
      container.requestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// 全屏状态变化监听
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
  // 全屏状态变化时重新调整图表大小
  setTimeout(() => {
    if (chartInstance) {
      chartInstance.resize();
    }
  }, 100);
};

const handleUpdate = ()=> {
  modalRef.value.closeModal();
}

// 初始化
onMounted(async () => {
  await nextTick();
  initChart();
  updateChart(props.graphData);
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

// 监听数据变化
watch(() => props.graphData, (newData) => {
  updateChart(newData);
}, { deep: true });

// 当过滤导致数据为空后再恢复为非空时，确保图表能重新初始化并显示
watch(() => props.graphData.nodes.length, async (len) => {
  if (len > 0) {
    await nextTick();
    if (!chartInstance && chartContainer.value) {
      initChart();
    }
    updateChart(props.graphData);
    // 恢复显示后调整尺寸
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    }, 0);
  }
});

// 监听主题变化，重新绘制图表
watch(isDark, () => {
  if (chartInstance && props.graphData.nodes.length > 0) {
    // 主题切换时重新绘制图表，更新颜色
    updateChart(props.graphData);
  }
});

// 组件卸载时清理
import { onUnmounted, computed } from 'vue';
import { useDesignSetting } from '@/store/modules/designSetting';
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

</script>

<style scoped>
.relation-graph-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 全屏时的样式 */
.relation-graph-container:fullscreen {
  background: var(--background);
  padding: 20px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
}

.fullscreen-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.relation-graph-container > div {
  width: 100%;
  height: 100%;
}

</style>
