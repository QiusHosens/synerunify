import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { HomeMenuResponse } from '@/api';
import RenderMenuItems from './MenuRender';

interface MenuContentProps {
  routeTree: HomeMenuResponse[];
}

export default function MenuContent({routeTree}: MenuContentProps) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {/* {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))} */}
        <RenderMenuItems routes={routeTree} />
      </List>
    </Stack>
  );
}
