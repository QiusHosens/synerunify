import { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

// 递归渲染菜单项
export default function RenderMenuItems({ routes, depth = 0 }: { routes: HomeMenuResponse[]; depth?: number }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<{ [key: number]: boolean }>({});

  const handleClick = (id: number) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {routes.map((item) => (
        <div key={item.path}>
          <ListItem disablePadding sx={{ pl: depth * 2 }}>
            <ListItemButton
              onClick={() => {
                if (item.children && item.children.length > 0) {
                  handleClick(item.id);
                } else {
                  navigate(item.path);
                }
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
      ))}
    </>
  );
};