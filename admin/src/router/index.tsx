import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore, useHomeStore } from '@/store';
import Login from '@/pages/Login';
// import Login from '@/pages/Login/SignIn';
// import Layout from '@/layout/BaseLayout/Layout';
import Layout from '@/layout/MainLayout/Layout';
import React from 'react';
import LoginLayout from '@/layout/LoginLayout';

// 动态组件映射
const componentMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<Element>> } = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
  'pages/MenuManage': lazy(() => import('@/pages/config/MenuManage')),
  'pages/DictManage': lazy(() => import('@/pages/config/DictManage')),
  'pages/DepartmentManage': lazy(() => import('@/pages/system/DepartmentManage')),
  'pages/TenantManage': lazy(() => import('@/pages/system/TenantManage')),
  'pages/RoleManage': lazy(() => import('@/pages/system/RoleManage')),
};

export default function Router() {
  const { access_token } = useAuthStore();
  const navigate = useNavigate();
  const { routes, fetchAndSetHome } = useHomeStore();

  // 获取动态路由
  useEffect(() => {
    // console.log('start init router')
    fetchAndSetHome(access_token);
  }, [access_token, fetchAndSetHome, navigate]);

  // 未登录时跳转到登录页
  if (!access_token) {
    navigate('/login');
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* 静态路由：登录页面 */}
        <Route path="/login" 
        // element={<Login />}
        element={
          <LoginLayout>
            <Login />
          </LoginLayout>} 
          />
        {/* 动态路由 */}
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout>
                {componentMap[route.component] ? (
                  React.createElement(componentMap[route.component])
                ) : (
                  <div>Component not found</div>
                )}
              </Layout>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
}