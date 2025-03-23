import { useRoutes } from 'react-router-dom';
import Layout from '@/layout';
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
  { path: '/login', element: <Login /> },
];

export default function Router() {
  return useRoutes(routes);
}