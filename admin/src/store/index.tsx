import { getHome, HomeMenuResponse } from '@/api';
import { systemColorSchemes } from '@/theme/themePrimitives';
import { deepClone } from '@/utils/objectUtils';
import { buildTreeRoutes } from '@/utils/routeUtils';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义字体类型
type FontFamily = 'Roboto' | 'Poppins' | 'Inter';

// 主题状态
interface ThemeState {
  mode: 'light' | 'dark';
  navPosition: 'left' | 'top' | 'bottom';
  primaryKey: string;
  primary: object | null;
  fontFamily: FontFamily;
  fontSize: number;
  setThemeMode: (mode: 'light' | 'dark') => void;
  setNavPosition: (position: 'left' | 'top' | 'bottom') => void;
  setPrimaryKey: (primaryKey: string) => void;
  setPrimary: (primary: string) => void;
  setFontFamily: (fontFamily: FontFamily) => void;
  setFontSize: (fontSize: number) => void;
}

// 授权状态
interface AuthState {
  isAuthenticated: boolean;
  token_type: string | null; // token类型
  access_token: string | null;
  refresh_token: string | null;
  login: (token_type: string, access_token: string, refresh_token: string) => void;
  logout: () => void;
}

// 主页状态,包括nickname,memus
interface HomeState {
  nickname: string | null; // 昵称
  routes: HomeMenuResponse[]; // 路由列表
  routeTree: HomeMenuResponse[]; // 路由树
  operates: HomeMenuResponse[]; // 操作
  setNickname: (nickname: string) => void;
  setRoutes: (routes: HomeMenuResponse[]) => void;
  setRouteTree: (routeTree: HomeMenuResponse[]) => void;
  setOperates: (routeTree: HomeMenuResponse[]) => void;
  fetchAndSetHome: (token: string | null) => Promise<void>;
}

// 创建主题 store
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      navPosition: 'left',
      primaryKey: '',
      primary: null,
      fontFamily: 'Roboto',
      fontSize: 16,
      setThemeMode: (mode) => {
        set({ mode })
      },
      setNavPosition: (position) => set({ navPosition: position }),
      setPrimaryKey: (primaryKey: string) => set({ primaryKey }),
      setPrimary: (primary: string) => {
        type ColorSchemeName = keyof typeof systemColorSchemes;
        const validColorSchemes = Object.keys(systemColorSchemes) as ColorSchemeName[];
        function isColorSchemeName(key: string): key is ColorSchemeName {
          return validColorSchemes.includes(key as ColorSchemeName);
        }
        if (isColorSchemeName(primary)) {
          set({ primary: systemColorSchemes[primary] })
          return;
        }
        set({ primary: {} })
      },
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize }),
    }), {
    name: 'theme-storage', // localStorage 中的键名
    // partialize: (state) => ({
    //   mode: state.mode,
    //   navPosition: state.navPosition,
    //   primary: state.primary,
    //   secondary: state.secondary,
    //   fontFamily: state.fontFamily,
    //   // fontSize 未包含，将不持久化
    // }),
    // storage: {
    //   getItem: (name) => {
    //     const value = localStorage.getItem(name);
    //     return value ? JSON.parse(value) : null;
    //   },
    //   setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    //   removeItem: (name) => localStorage.removeItem(name),
    // },
  }));

// 创建认证 store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token_type: null, // token类型
      access_token: null,
      refresh_token: null,
      login: (token_type: string, access_token: string, refresh_token: string) => set({ isAuthenticated: true, token_type, access_token, refresh_token }),
      logout: () => set({ isAuthenticated: false, token_type: null, access_token: null, refresh_token: null }),
    }), {
    name: 'auth-storage', // localStorage 中的键名
  }));

export const useHomeStore = create<HomeState>((set) => ({
  nickname: null,
  routes: [],
  routeTree: [],
  operates: [],
  setNickname: (nickname) => set({ nickname }),
  setRoutes: (routes) => set({ routes }),
  setRouteTree: (routeTree) => set({ routeTree }),
  setOperates: (operates) => set({ operates }),
  fetchAndSetHome: async (token) => {
    const logout = () => {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    if (token) {
      try {
        const routeData = await getHome();
        set({ nickname: routeData.nickname });
        let menus = routeData.menus;
        // 排序
        menus = menus.sort((m1, m2) => m1.sort - m2.sort);
        // 处理路由
        let routes = deepClone(menus);
        routes = routes.filter(route => route.type == 2);
        // 添加默认路由为第一个
        if (routes.length > 0) {
          let first = deepClone(routes[0]);
          first.path = '/';
          routes.splice(0, 0, first);
        }

        // 菜单
        let menuRoutes = deepClone(menus);
        menuRoutes = menuRoutes.filter(route => route.type !== 3);

        // 操作
        let operates = deepClone(menus);
        operates = operates.filter(route => route.type == 3);

        set({ routes: routes });
        set({ routeTree: buildTreeRoutes(menuRoutes) });
        set({ operates: operates });
      } catch (error) {
        console.error('Failed to fetch routes:', error);
        set({ routes: [] }); // 获取失败时清空路由
        set({ routeTree: [] });
        set({ operates: [] });
        // 退出登录
        logout();
      }
    } else {
      set({ routes: [] }); // 无 token 时清空路由
      set({ routeTree: [] });
      set({ operates: [] });
      // 退出登录
      logout();
    }
  },
}));