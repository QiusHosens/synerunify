import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
          width: '100%',
          backgroundColor: (theme) => theme.palette.grey[200],
          ...sx, // 合并外部传入的 sx
        }}
      >
        <List sx={{ display: 'flex' }}>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}