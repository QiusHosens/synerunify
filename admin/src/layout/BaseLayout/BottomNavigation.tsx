import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store';
import { SxProps, Theme } from '@mui/material/styles';
import { HomeMenuResponse } from '@/api';

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
          position: 'absolute',
          left: '10%',
          width: '80%',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.grey[200],
          ...sx, // 合并外部传入的 sx
        }}
      >
        {routeTree.map((item) => (
          <Box key={item.id} sx={{
            width: 52,
            height: 52,
            borderRadius: 1,
            border: 1,
            ml: 2
          }}>
            {item.name}
          </Box>
        ))}
      </Box>
    </>
  )
}