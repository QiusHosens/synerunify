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

  // 递归排序函数
  const sortRoutes = (routes: HomeMenuResponse[]): HomeMenuResponse[] => {
    // 按照 sort 字段排序当前层级
    routes.sort((a, b) => a.sort - b.sort);
    
    // 对每个节点的 children 递归排序
    routes.forEach(route => {
      if (route.children && route.children.length > 0) {
        route.children = sortRoutes(route.children);
      }
    });
    
    return routes;
  };

  // 对整个树结构进行排序并返回
  return sortRoutes(result);
};