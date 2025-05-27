import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { HomeMenuResponse } from '@/api';
import RenderMenuItems from './MenuRender';

interface MenuContentProps {
  routeTree: HomeMenuResponse[];
}

export default function MenuContent({routeTree}: MenuContentProps) {
  return (
    <Stack sx={{ flexGrow: 1, pl: 2, pr: 2, justifyContent: 'space-between' }}>
      <List dense>
        <RenderMenuItems routes={routeTree} />
      </List>
    </Stack>
  );
}
