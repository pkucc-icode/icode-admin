import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { OptionsSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    name: 'test',
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      icon: renderIcon(OptionsSharp),
      activeMenu: 'test_index',
    },
    children: [
      {
        path: 'index',
        name: `test_index`,
        meta: {
          title: '测试组件',
          activeMenu: 'test_index',
        },
        component: () => import('@/views/test/index.vue'),
      },
    ],
  },
];

export default routes;
