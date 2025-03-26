import { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { HomeMenuResponse } from '@/api';
import React from 'react';

// 图标映射
const iconMap: { [key: string]: React.ElementType } = {
  DashboardIcon,
  PersonIcon,
  PersonOutlineIcon,
  SettingsIcon,
};

// 检查路由是否匹配或包含在子路由中
const isRouteActive = (routePath: string, currentPath: string, children?: HomeMenuResponse[]): boolean => {
  if (routePath === currentPath) return true;
  if (children) {
    return children.some((child) => isRouteActive(child.path, currentPath, child.children));
  }
  return false;
};

// 递归渲染菜单项
export default function RenderMenuItems({ routes, depth = 0 }: { routes: HomeMenuResponse[]; depth?: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<{ [key: number]: boolean }>({});

  // 初始化展开状态：如果子路由匹配当前路径，展开父菜单
  useEffect(() => {
    const initialOpen: { [key: number]: boolean } = {};
    const setInitialOpen = (items: HomeMenuResponse[]) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          if (isRouteActive(item.path, location.pathname, item.children)) {
            initialOpen[item.id] = true;
          }
          setInitialOpen(item.children);
        }
      });
    };
    setInitialOpen(routes);
    setOpen((prev) => ({ ...prev, ...initialOpen }));
  }, [routes, location.pathname]);

  const handleClick = (id: number) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {routes.map((item) => {
        const isActive = isRouteActive(item.path, location.pathname, item.children);
        return (
          <div key={item.path}>
            <ListItem disablePadding sx={{ pl: depth * 2 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  if (item.children && item.children.length > 0) {
                    handleClick(item.id);
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  },
                }}
              >
                <ListItemIcon>{iconMap[item.icon] && React.createElement(iconMap[item.icon])}</ListItemIcon>
                <ListItemText primary={item.name} />
                {item.children && item.children.length > 0 && (open[item.id] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.children && item.children.length > 0 && (
              <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <RenderMenuItems routes={item.children} depth={depth + 1} />
                </List>
              </Collapse>
            )}
          </div>
        );
      })}
    </>
  );
};