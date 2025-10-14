<template>
  <n-layout class="layout" :position="fixedMenu" has-sider>
    <n-layout-sider
      v-if="
        !isMobile && isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')
      "
      @collapse="collapsed = true"
      :position="fixedMenu"
      @expand="collapsed = false"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted"
      class="layout-sider glass-card rounded-[30px]"
    >
      
      <Logo :collapsed="collapsed"/>
      <ScrollArea class="h-[calc(100vh-152px)]">
        <AsideMenu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
      </ScrollArea>
    </n-layout-sider>

    <!-- <n-drawer
      v-model:show="showSideDrawer"
      :width="menuWidth"
      :placement="'left'"
      class="layout-side-drawer"
    >
      <n-layout-sider
        :position="fixedMenu"
        :collapsed="false"
        :width="menuWidth"
        :native-scrollbar="false"
        :inverted="inverted"
        class="layout-sider"
      >
        <Logo :collapsed="collapsed" />
        <AsideMenu v-model:location="getMenuLocation" />
      </n-layout-sider>
    </n-drawer> -->

    <n-layout :inverted="inverted" class="bg-transparent flex flex-col">
      <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader" class="bg-transparent">
        <div class="rounded-[30px] mt-4 mr-4 ml-2 glass-card ">
          <PageHeader v-model:collapsed="collapsed" :inverted="inverted" />
        </div>
      </n-layout-header>
      <transition :name="getTransitionName" mode="out-in" appear>
        <div class="h-[calc(100vh-96px)] ml-2 mr-4 mt-[80px] overflow-y-hidden rounded-[30px] glass-card relative"
        >
          <ScrollArea
            class="p-4"
            :class="{
              'h-[calc(100vh-152px)] bottom-0 absolute w-full': fixedMulti
            }"
          >
            <TabsView v-if="isMultiTabs" v-model:collapsed="collapsed" />                     

            <div
              class="layout-content-main"
              :class="{
                'layout-content-main-fix': fixedMulti,
                'fluid-header': fixedHeader === 'static',
              }"
            >
              <MainView />
            </div>
            <!--1.15废弃，没啥用，占用操作空间-->
            <!--        <NLayoutFooter v-if="getShowFooter">-->
            <!--          <PageFooter />-->
            <!--        </NLayoutFooter>-->
          </ScrollArea>

        </div>
      </transition>


      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, onMounted } from 'vue'
  import { ScrollArea } from '@/components/ScrollArea';
  import { Logo } from './components/Logo';
  import { TabsView } from './components/TagsView';
  import { MainView } from './components/Main';
  import { AsideMenu } from './components/Menu';
  import { PageHeader } from './components/Header';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';
  import { useRoute } from 'vue-router';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';

  const { getDarkTheme } = useDesignSetting();
  const {
    // showFooter,
    navMode,
    navTheme,
    headerSetting,
    menuSetting,
    multiTabsSetting,
  } = useProjectSetting();

  const settingStore = useProjectSettingStore();

  const collapsed = ref<boolean>(false);

  const { mobileWidth, menuWidth } = unref(menuSetting);

  const isMobile = computed<boolean>({
    get: () => settingStore.getIsMobile,
    set: (val) => settingStore.setIsMobile(val),
  });

  const fixedHeader = computed(() => {
    const { fixed } = unref(headerSetting);
    return fixed ? 'absolute' : 'static';
  });

  const isMixMenuNoneSub = computed(() => {
    const mixMenu = unref(menuSetting).mixMenu;
    const currentRoute = useRoute();
    if (unref(navMode) != 'horizontal-mix') return true;
    if (unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot) {
      return false;
    }
    return true;
  });

  const fixedMenu = computed(() => {
    const { fixed } = unref(headerSetting);
    return fixed ? 'absolute' : 'static';
  });

  const isMultiTabs = computed(() => {
    return unref(multiTabsSetting).show;
  });

  const fixedMulti = computed(() => {
    return unref(multiTabsSetting).fixed;
  });

  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(navTheme));
  });

  const getHeaderInverted = computed(() => {
    return ['light', 'header-dark'].includes(unref(navTheme)) ? unref(inverted) : !unref(inverted);
  });

  const leftMenuWidth = computed(() => {
    const { minMenuWidth, menuWidth } = unref(menuSetting);
    return collapsed.value ? minMenuWidth : menuWidth;
  });

  const getMenuLocation = computed(() => {
    return 'left';
  });

  // 控制显示或隐藏移动端侧边栏
  // const showSideDrawer = computed({
  //   get: () => isMobile.value && collapsed.value,
  //   set: (val) => (collapsed.value = val),
  // });

  //判断是否触发移动端模式
  const checkMobileMode = () => {
    if (document.body.clientWidth <= mobileWidth) {
      isMobile.value = true;
    } else {
      isMobile.value = false;
    }
    collapsed.value = false;
  };

  const watchWidth = () => {
    const Width = document.body.clientWidth;
    if (Width <= 950) {
      collapsed.value = true;
    } else collapsed.value = false;

    checkMobileMode();
  };

  onMounted(() => {
    checkMobileMode();
    window.addEventListener('resize', watchWidth);
  });
</script>

<style lang="less">
  .layout-side-drawer {
    // background-color: rgb(0, 20, 40);

    .layout-sider {
      min-height: 100vh;
      // box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      position: relative;
      z-index: 13;
      transition: all 0.2s ease-in-out;
    }
  }
</style>
<style lang="less" scoped>
  .layout {
    display: flex;
    flex-direction: row;
    flex: auto;
    // background-image: linear-gradient(to right bottom, #f6eaea, #ffefef);
    // background: url("/R-C.jpg") no-repeat center center / cover !important;
    background: var(--background);

    &-default-background {
      background: var(--background);
    }

    .layout-sider {
      min-height: calc(100vh - 32px);
      margin: 16px 8px 16px 16px;
      // box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      position: relative;
      z-index: 13;
      transition: all 0.2s ease-in-out;
    }

    .layout-sider-fix {
      position: fixed;
      top: 0;
      left: 0;
    }

    .ant-layout {
      overflow: hidden;
    }

    .layout-right-fix {
      overflow-x: hidden;
      padding-left: 200px;
      min-height: 100vh;
      transition: all 0.2s ease-in-out;
    }

    .layout-content {
      // flex: auto;
      width: 100%;
      height: 100%;
    }

    .n-layout-header.n-layout-header--absolute-positioned {
      z-index: 11;
    }

    .n-layout-footer {
      background: none;
    }
  }

  .layout-content-main {
    position: relative;
  }

  // .layout-content-main-fix {
    // margin-top: 42px;    
  // }

  .fluid-header {
    padding-top: 0;
  }

  // .main-view-fix {
    // padding-top: 44px;
  // }

  .noMultiTabs {
    padding-top: 0;
  }

</style>
