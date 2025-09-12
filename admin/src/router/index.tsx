import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useHomeStore } from '@/store';
import Login from '@/pages/Login';
// import Login from '@/pages/Login/SignIn';
// import Layout from '@/layout/BaseLayout/Layout';
import Layout from '@/layout/MainLayout/Layout';
import React from 'react';
import LoginLayout from '@/layout/LoginLayout';
import { Box, CircularProgress, Typography } from '@mui/material';

// 动态组件映射
const componentMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<Element>> } = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
  'pages/config/MenuManage': lazy(() => import('@/pages/config/MenuManage')),
  'pages/config/DictManage': lazy(() => import('@/pages/config/DictManage')),
  'pages/system/DepartmentManage': lazy(() => import('@/pages/system/DepartmentManage')),
  'pages/system/tenant/TenantPackageManage': lazy(() => import('@/pages/system/tenant/TenantPackageManage')),
  'pages/system/tenant/TenantListManage': lazy(() => import('@/pages/system/tenant/TenantListManage')),
  'pages/system/RoleManage': lazy(() => import('@/pages/system/RoleManage')),
  'pages/system/PostManage': lazy(() => import('@/pages/system/PostManage')),
  'pages/system/UserManage': lazy(() => import('@/pages/system/UserManage')),
  'pages/system/audit/OperationLogger': lazy(() => import('@/pages/system/audit/OperationLogger')),
  'pages/system/audit/LoginLogger': lazy(() => import('@/pages/system/audit/LoginLogger')),

  'pages/erp/purchase/PurchaseOrder': lazy(() => import('@/pages/erp/purchase/PurchaseOrder')),
  'pages/erp/purchase/PurchaseInbound': lazy(() => import('@/pages/erp/purchase/PurchaseInbound')),
  'pages/erp/purchase/PurchaseReturn': lazy(() => import('@/pages/erp/purchase/PurchaseReturn')),
  'pages/erp/purchase/PurchaseSupplier': lazy(() => import('@/pages/erp/purchase/PurchaseSupplier')),
  'pages/erp/sale/SaleOrder': lazy(() => import('@/pages/erp/sale/SaleOrder')),
  'pages/erp/sale/SaleOutbound': lazy(() => import('@/pages/erp/sale/SaleOutbound')),
  'pages/erp/sale/SaleReturn': lazy(() => import('@/pages/erp/sale/SaleReturn')),
  'pages/erp/sale/SaleCustomer': lazy(() => import('@/pages/erp/sale/SaleCustomer')),
  'pages/erp/inventory/InventoryWarehouse': lazy(() => import('@/pages/erp/inventory/InventoryWarehouse')),
  'pages/erp/inventory/InventoryProduct': lazy(() => import('@/pages/erp/inventory/InventoryProduct')),
  'pages/erp/inventory/InventoryRecord': lazy(() => import('@/pages/erp/inventory/InventoryRecord')),
  'pages/erp/inventory/InventoryInbound': lazy(() => import('@/pages/erp/inventory/InventoryInbound')),
  'pages/erp/inventory/InventoryOutbound': lazy(() => import('@/pages/erp/inventory/InventoryOutbound')),
  'pages/erp/inventory/InventoryTransfer': lazy(() => import('@/pages/erp/inventory/InventoryTransfer')),
  'pages/erp/inventory/InventoryCheck': lazy(() => import('@/pages/erp/inventory/InventoryCheck')),
  'pages/erp/product/ProductList': lazy(() => import('@/pages/erp/product/ProductList')),
  'pages/erp/product/ProductCategory': lazy(() => import('@/pages/erp/product/ProductCategory')),
  'pages/erp/product/ProductUnit': lazy(() => import('@/pages/erp/product/ProductUnit')),
  'pages/erp/financial/FinancialPayment': lazy(() => import('@/pages/erp/financial/FinancialPayment')),
  'pages/erp/financial/FinancialReceipt': lazy(() => import('@/pages/erp/financial/FinancialReceipt')),
  'pages/erp/financial/FinancialAccount': lazy(() => import('@/pages/erp/financial/FinancialAccount')),

  'pages/mall/product/ProductList': lazy(() => import('@/pages/mall/product/ProductList')),
  'pages/mall/product/ProductCategory': lazy(() => import('@/pages/mall/product/ProductCategory')),
  'pages/mall/product/ProductBrand': lazy(() => import('@/pages/mall/product/ProductBrand')),
  'pages/mall/product/ProductProperty': lazy(() => import('@/pages/mall/product/ProductProperty')),
  'pages/mall/product/ProductComment': lazy(() => import('@/pages/mall/product/ProductComment')),
  'pages/mall/trade/delivery/express/Company': lazy(() => import('@/pages/mall/trade/delivery/express/Company')),
  'pages/mall/trade/delivery/express/Template': lazy(() => import('@/pages/mall/trade/delivery/express/Template')),
  'pages/mall/trade/delivery/store/Store': lazy(() => import('@/pages/mall/trade/delivery/store/Store')),
};

export default function Router() {
  const { access_token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFetched, routes, routeTree, fetchAndSetHome } = useHomeStore();
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);

  const hasInit = useRef(false);

  // 获取动态路由
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (hasInit.current) {
      return;
    }
    hasInit.current = true;
    setLoading(true);
    if (!hasFetched) {
      await fetchAndSetHome(access_token);
    }
    setLoading(false);
  }

  // console.log('location', location.pathname);
  // // 未登录时跳转到登录页
  if (!access_token && location.pathname != '/login') {
    navigate('/login');
  }

  return (
    <Suspense
      fallback={
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      }>
      {/*  sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} */}
      {loading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
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
                <Layout routeTree={routeTree}>
                  {componentMap[route.component] ? (
                    React.createElement(componentMap[route.component])
                  ) : (
                    <div>Component not found</div>
                  )}
                </Layout>
              }
            />
          ))}
        </Routes>)
      }
    </Suspense>
  );
}