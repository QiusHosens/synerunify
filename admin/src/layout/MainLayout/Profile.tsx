import React, { useState } from 'react';
import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Box,
  Stack,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { useAuthStore, useHomeStore } from '@/store';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';

const Profile: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { nickname } = useHomeStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const logout = () => {
    useAuthStore.getState().logout();
  }

  const switchAccount = () => {
    useAuthStore.getState().logout();
  }

  const list = () => (
    <Box
      sx={{ width: 320, p: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Stack direction='row' gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar>{nickname ? nickname.charAt(0) : 'S'}</Avatar>
          <Typography variant="body1" fontWeight="600">
            {nickname}
          </Typography>
        </Stack>
        <Stack direction='row' gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton title={t('global.layout.profile.title.swtich.account')} sx={{ cursor: 'pointer' }} onClick={switchAccount}>
            <SwapHorizIcon fontSize='small' />
          </IconButton>
          <IconButton sx={{ cursor: 'pointer' }} onClick={toggleDrawer(false)}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Stack>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 2 }} onClick={logout}>
            <Stack direction='row' gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
              <LogoutIcon sx={{ fontSize: '1.125rem', color: theme.palette.action.active }} />
              <Typography variant="body1">
                {t('global.layout.profile.title.logout')}
              </Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      </List>

      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      <Avatar onClick={toggleDrawer(true)} sx={{ cursor: 'pointer' }} >{nickname ? nickname.charAt(0) : 'S'}</Avatar>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
};

export default Profile;