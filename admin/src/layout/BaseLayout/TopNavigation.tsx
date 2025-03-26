import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';
import { HomeMenuResponse } from '@/api';
import RenderMenuItems from './MenuRender';

interface TopNavProps {
  sx?: SxProps<Theme>;
  routeTree: HomeMenuResponse[];
}

export default function TopNav({ sx, routeTree }: TopNavProps) {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: (theme) => theme.palette.grey[200],
          ...sx, // 合并外部传入的 sx
        }}
      >
        <List sx={{ display: 'flex' }}>
          <RenderMenuItems routes={routeTree} />
        </List>
      </Box>
    </>
  )
}