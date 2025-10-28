import { defineStore } from 'pinia';
import { store } from '@/store';
import designSetting from '@/settings/designSetting';

const { darkTheme, appTheme, appThemeList } = designSetting;

interface DesignSettingState {
  //深色主题
  darkTheme: boolean;
  //系统风格
  appTheme: string;
  //系统内置风格
  appThemeList: string[];
}

// LocalStorage 键名
const DESIGN_SETTING_KEY = 'design-setting';

// 从 localStorage 加载设置
const loadFromStorage = (): Partial<DesignSettingState> => {
  try {
    const stored = localStorage.getItem(DESIGN_SETTING_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load design settings from localStorage:', error);
    return {};
  }
};

// 保存设置到 localStorage
const saveToStorage = (state: DesignSettingState) => {
  try {
    localStorage.setItem(DESIGN_SETTING_KEY, JSON.stringify({
      darkTheme: state.darkTheme,
      appTheme: state.appTheme,
    }));
  } catch (error) {
    console.error('Failed to save design settings to localStorage:', error);
  }
};

export const useDesignSettingStore = defineStore({
  id: 'app-design-setting',
  state: (): DesignSettingState => {
    const stored = loadFromStorage();
    return {
      darkTheme: stored.darkTheme ?? darkTheme,
      appTheme: stored.appTheme ?? appTheme,
      appThemeList,
    };
  },
  getters: {
    getDarkTheme(): boolean {
      return this.darkTheme;
    },
    getAppTheme(): string {
      return this.appTheme;
    },
    getAppThemeList(): string[] {
      return this.appThemeList;
    },
  },
  actions: {
    setDarkTheme(dark: boolean) {
      this.darkTheme = dark;
      // 切换 HTML 元素的 dark 类，让 CSS 变量生效
      if (typeof document !== 'undefined') {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      // 保存到 localStorage
      saveToStorage(this.$state);
    },
    setAppTheme(theme: string) {
      this.appTheme = theme;
      // 保存到 localStorage
      saveToStorage(this.$state);
    },
    // 初始化时应用主题
    initTheme() {
      if (typeof document !== 'undefined') {
        if (this.darkTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});

// Need to be used outside the setup
export function useDesignSetting() {
  return useDesignSettingStore(store);
}
