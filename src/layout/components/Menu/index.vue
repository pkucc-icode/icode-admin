<template>
  <NMenu
    :options="menus"
    :inverted="inverted"
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="openKeys"
    :value="getSelectedKeys"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
    :theme-overrides="customTheme"
    :key="inverted ? 'menu-dark' : 'menu-light'"
  />
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, reactive, computed, watch, toRefs, unref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAsyncRouteStore } from '@/store/modules/asyncRoute';
  import { generatorMenu, generatorMenuMix } from '@/utils';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';

  export default defineComponent({
    name: 'AppMenu',
    components: {},
    props: {
      mode: {
        // 菜单模式
        type: String,
        default: 'vertical',
      },
      collapsed: {
        // 侧边栏菜单是否收起
        type: Boolean,
      },
      //位置
      location: {
        type: String,
        default: 'left',
      },
    },
    emits: ['update:collapsed', 'clickMenuItem'],
    setup(props, { emit }) {
      // 当前路由
      const currentRoute = useRoute();
      const router = useRouter();
      const asyncRouteStore = useAsyncRouteStore();
      const settingStore = useProjectSettingStore();
      const menus = ref<any[]>([]);
      const selectedKeys = ref<string>(currentRoute.name as string);
      const headerMenuSelectKey = ref<string>('');

      const { navMode } = useProjectSetting();

      const customTheme = computed(() => {
        // 基于 CSS 变量的统一色彩定义
        const base = {
          itemTextColor: 'var(--foreground)',
          itemIconColor: 'var(--primary)',

          itemColorHover: 'var(--muted)',
          itemTextColorHover: 'var(--muted-foreground)',
          itemIconColorHover: 'var(--muted-foreground)',

          itemColorActive: 'var(--primary)',
          itemColorActiveCollapsed: 'var(--primary)',
          itemTextColorActive: 'var(--accent-foreground)',
          itemIconColorActive: 'var(--accent-foreground)',

          itemColorActiveHover: 'var(--primary)',
          itemTextColorActiveHover: 'var(--accent-foreground)',
          itemIconColorActiveHover: 'var(--accent-foreground)',

          itemColorChildActive: 'var(--primary)',
          itemTextColorChildActive: 'var(--primary)',
          itemIconColorChildActive: 'var(--primary)',

          itemColorChildActiveHover: 'var(--primary)',
          itemTextColorChildActiveHover: 'var(--primary)',
          itemIconColorChildActiveHover: 'var(--primary)',

          // 圆角
          borderRadius: '0.5rem'
        } as const

        // 让箭头颜色与文本颜色保持一致（普通模式）
        const arrowFromText = {
          arrowColor: base.itemTextColor,
          arrowColorHover: base.itemTextColorHover,
          arrowColorActive: base.itemTextColorActive,
          arrowColorActiveHover: base.itemTextColorActiveHover,
          arrowColorChildActive: base.itemTextColorChildActive,
          arrowColorChildActiveHover: base.itemTextColorChildActiveHover,
        } as const

        // 为 inverted（暗色）模式提供对应的覆盖键，确保 :inverted 时生效
        const inverted = {
          itemTextColorInverted: base.itemTextColor,
          itemIconColorInverted: base.itemIconColor,

          itemColorHoverInverted: base.itemColorHover,
          itemTextColorHoverInverted: base.itemTextColorHover,
          itemIconColorHoverInverted: base.itemIconColorHover,

          itemColorActiveInverted: base.itemColorActive,
          itemColorActiveCollapsedInverted: base.itemColorActiveCollapsed,
          itemTextColorActiveInverted: base.itemTextColorActive,
          itemIconColorActiveInverted: base.itemIconColorActive,

          itemColorActiveHoverInverted: base.itemColorActiveHover,
          itemTextColorActiveHoverInverted: base.itemTextColorActiveHover,
          itemIconColorActiveHoverInverted: base.itemIconColorActiveHover,

          itemTextColorChildActiveInverted: base.itemTextColorChildActive,
          itemIconColorChildActiveInverted: base.itemIconColorChildActive,

          itemColorChildActiveHoverInverted: base.itemColorChildActiveHover,
          itemTextColorChildActiveHoverInverted: base.itemTextColorChildActiveHover,
          itemIconColorChildActiveHoverInverted: base.itemIconColorChildActiveHover,
          
          arrowColorInverted: base.itemTextColor,
          arrowColorHoverInverted: base.itemTextColorHover,
          arrowColorActiveInverted: base.itemTextColorActive,
          arrowColorActiveHoverInverted: base.itemTextColorActiveHover,
          arrowColorChildActiveInverted: base.itemTextColorChildActive,
          arrowColorChildActiveHoverInverted: base.itemTextColorChildActiveHover,

          borderRadius: base.borderRadius,
        } as const

        return {
          ...base,
          ...arrowFromText,
          ...inverted,
        }
      });

      // 获取当前打开的子菜单
      const matched = currentRoute.matched;

      const getOpenKeys = matched && matched.length ? matched.map((item) => item.name) : [];

      const state = reactive({
        openKeys: getOpenKeys,
      });

      const inverted = computed(() => {
        return ['dark', 'header-dark'].includes(settingStore.navTheme);
      });

      const getSelectedKeys = computed(() => {
        let location = props.location;
        return location === 'left' || (location === 'header' && unref(navMode) === 'horizontal')
          ? unref(selectedKeys)
          : unref(headerMenuSelectKey);
      });

      // 监听分割菜单
      watch(
        () => settingStore.menuSetting.mixMenu,
        () => {
          updateMenu();
          if (props.collapsed) {
            emit('update:collapsed', !props.collapsed);
          }
        }
      );

      // 跟随页面路由变化，切换菜单选中状态
      watch(
        () => currentRoute.fullPath,
        () => {
          updateMenu();
        }
      );

      function updateSelectedKeys() {
        const matched = currentRoute.matched;
        state.openKeys = matched.map((item) => item.name);
        const activeMenu: string = (currentRoute.meta?.activeMenu as string) || '';
        selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string);
      }

      function updateMenu() {
        if (!settingStore.menuSetting.mixMenu) {
          menus.value = generatorMenu(asyncRouteStore.getMenus);
        } else {
          //混合菜单
          const firstRouteName: string = (currentRoute.matched[0].name as string) || '';
          menus.value = generatorMenuMix(asyncRouteStore.getMenus, firstRouteName, props.location);
          const activeMenu: string = currentRoute?.matched[0].meta?.activeMenu as string;
          headerMenuSelectKey.value = (activeMenu ? activeMenu : firstRouteName) || '';
        }
        updateSelectedKeys();
      }

      // 点击菜单
      function clickMenuItem(key: string) {
        if (/http(s)?:/.test(key)) {
          window.open(key);
        } else {
          router.push({ name: key });
        }
        emit('clickMenuItem' as any, key);
      }

      //展开菜单
      function menuExpanded(openKeys: string[]) {
        if (!openKeys) return;
        const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1);
        const isExistChildren = findChildrenLen(latestOpenKey as string);
        state.openKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys;
      }

      //查找是否存在子路由
      function findChildrenLen(key: string) {
        if (!key) return false;
        const subRouteChildren: string[] = [];
        for (const { children, key } of unref(menus)) {
          if (children && children.length) {
            subRouteChildren.push(key as string);
          }
        }
        return subRouteChildren.includes(key);
      }

      onMounted(() => {
        updateMenu();
      });

      return {
        ...toRefs(state),
        inverted,
        menus,
        selectedKeys,
        headerMenuSelectKey,
        getSelectedKeys,
        clickMenuItem,
        menuExpanded,
        customTheme
      };
    },
  });
</script>
