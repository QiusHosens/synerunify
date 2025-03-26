import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';
import { HomeMenuResponse } from '@/api';
import { useState } from 'react';
import RenderMenuItems from './MenuRender';

interface LeftNavProps {
  sx?: SxProps<Theme>;
  routeTree: HomeMenuResponse[];
  leftNavWidth: number;
}

export default function LeftNav({ sx, routeTree, leftNavWidth }: LeftNavProps) {
  const navigate = useNavigate();

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: leftNavWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: leftNavWidth,
            boxSizing: 'border-box',
          },
          ...sx, // 合并外部传入的 sx
        }}
      >
        <List>
          <RenderMenuItems routes={routeTree} />
        </List>
      </Drawer>
    </>
  )
}