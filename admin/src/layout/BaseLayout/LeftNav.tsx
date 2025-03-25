import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';

interface LeftNavProps {
  sx?: SxProps<Theme>;
  navItems: Array<any>;
  leftNavWidth: number;
}

export default function LeftNav({ sx, navItems, leftNavWidth }: LeftNavProps) {
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
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
    </>
  )
}