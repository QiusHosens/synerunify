import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/system_auth/login",
    method: "post",
    response: () => ({
      code: 200,
      message: "success",
      data: {
        access_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VfdHlwZSI6IndlYiIsInN1YiI6MSwidGVuYW50X2lkIjoxLCJleHAiOjE3NDMyMDQ0MzcsImlhdCI6MTc0MzIwMzUzN30.90nCB9BKAdh5P3NEAOo4teCh0oTlHyJVJkP2aYZeB-w",
        exp: 1743808337,
        iat: 1743203537,
        refresh_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VfdHlwZSI6IndlYiIsInN1YiI6MSwidGVuYW50X2lkIjoxLCJleHAiOjE3NDM4MDgzMzcsImlhdCI6MTc0MzIwMzUzN30.6L-iQkUKIs-RoR4Us-BcU121hsQyI-4BrloqUB-3fwo",
        token_type: "Bearer",
      },
    }),
  },
  {
    url: "/api/system_auth/refresh_token",
    method: "post",
    response: () => ({
      code: 200,
      message: "success",
      data: {
        access_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VfdHlwZSI6IndlYiIsInN1YiI6MSwidGVuYW50X2lkIjoxLCJleHAiOjE3NDMyMDQ0MzcsImlhdCI6MTc0MzIwMzUzN30.90nCB9BKAdh5P3NEAOo4teCh0oTlHyJVJkP2aYZeB-w",
        exp: 1743808337,
        iat: 1743203537,
        refresh_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VfdHlwZSI6IndlYiIsInN1YiI6MSwidGVuYW50X2lkIjoxLCJleHAiOjE3NDM4MDgzMzcsImlhdCI6MTc0MzIwMzUzN30.6L-iQkUKIs-RoR4Us-BcU121hsQyI-4BrloqUB-3fwo",
        token_type: "Bearer",
      },
    }),
  },
  {
    url: "/api/system_auth/home",
    method: "get",
    response: () => {
      // console.log('Request headers:', headers); // 验证 token 是否携带
      return {
        code: 200,
        message: "success",
        data: {
          nickname: "超级管理员",
          menus: [
            {
              always_show: true,
              component: "pages/Dashboard",
              component_name: "Dashboard",
              icon: "#",
              id: 1,
              keep_alive: true,
              name: "Dashboard",
              parent_id: 0,
              path: "/dashboard",
              sort: 50,
              status: 0,
              type: 2,
              visible: true,
            },
            {
              always_show: true,
              component: null,
              component_name: null,
              icon: "#",
              id: 2,
              keep_alive: true,
              name: "系统管理",
              parent_id: 0,
              path: "/system",
              sort: 100,
              status: 0,
              type: 1,
              visible: true,
            },
            {
              always_show: true,
              component: null,
              component_name: null,
              icon: "#",
              id: 3,
              keep_alive: true,
              name: "配置管理",
              parent_id: 0,
              path: "/config",
              sort: 200,
              status: 0,
              type: 1,
              visible: true,
            },
            {
              always_show: true,
              component: "pages/DictManage",
              component_name: "DictManage",
              icon: "#",
              id: 4,
              keep_alive: true,
              name: "字典管理",
              parent_id: 2,
              path: "/config/dict",
              sort: 101,
              status: 0,
              type: 2,
              visible: true,
            },
            {
              always_show: true,
              component: "pages/MenuManage",
              component_name: "MenuManage",
              icon: "#",
              id: 5,
              keep_alive: true,
              name: "菜单管理",
              parent_id: 2,
              path: "/config/menu",
              sort: 102,
              status: 0,
              type: 2,
              visible: true,
            },
          ],
        },
      };
    },
  },
] as MockMethod[];
