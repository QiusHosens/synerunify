import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store';
import { SxProps, Theme } from '@mui/material/styles';

interface TopNavProps {
  sx?: SxProps<Theme>;
  navItems: Array<any>;
}

export default function TopNav({ sx, navItems }: TopNavProps) {
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
        {navItems.map((item) => (
          <Box key={item.label} sx={{
            width: 52,
            height: 52,
            borderRadius: 1,
            border: 1,
            ml: 2
          }}>
            {item.label}
          </Box>
        ))}
      </Box>
    </>
  )
}