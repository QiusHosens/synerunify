import { HomeMenuResponse } from "@/api";

// 将路由列表转换为树结构
export const buildTreeRoutes = (routes: HomeMenuResponse[]): HomeMenuResponse[] => {
  const routeMap = new Map<number, HomeMenuResponse>();
  const result: HomeMenuResponse[] = [];

  // 先将所有路由放入 Map
  routes.forEach((route) => {
    routeMap.set(route.id, { ...route, children: [] });
  });

  // 构建嵌套结构
  routeMap.forEach((route) => {
    if (route.parent_id) {
      const parent = routeMap.get(route.parent_id);
      if (parent) {
        parent.children!.push(route);
      }
    } else {
      result.push(route);
    }
  });

  return result;
};