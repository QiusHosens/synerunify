import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore, useHomeStore } from '@/store';
import Login from '@/pages/Login';
import Layout from '@/layout/BaseLayout/Layout';
import React from 'react';
import LoginLayout from '@/layout/LoginLayout';

// 动态组件映射
const componentMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<Element>> } = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
  'pages/MenuManage': lazy(() => import('@/pages/MenuManage')),
  'pages/DictManage': lazy(() => import('@/pages/DictManage')),
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
        <Route path="/login" element={
          <LoginLayout>
            <Login />
          </LoginLayout>} />
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