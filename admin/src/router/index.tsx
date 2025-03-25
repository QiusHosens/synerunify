import { useRoutes } from 'react-router-dom';
import Layout from '@/layout/BaseLayout';
import LoginLayout from '@/layout/LoginLayout'; // 新增导入
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
  {
    path: '/login',
    element: (
      <LoginLayout>
        <Login />
      </LoginLayout>
    ),
  },
];

export default function Router() {
  return useRoutes(routes);
}