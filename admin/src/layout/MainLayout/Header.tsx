import * as React from 'react';
import { styled, SxProps, Theme } from "@mui/material/styles";
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from './ColorModeIconDropdown';

import Search from './Search';
import { useThemeStore } from '@/store';
import SettingsButton from '@/components/SettingsButton';

interface HeaderProps {
  sx?: SxProps<Theme>;
  sideMenuWidth: number;
  height: number;
}

export default function Header({ sx, sideMenuWidth, height }: HeaderProps) {
  const { navPosition } = useThemeStore();

  return (
    <Stack
      // position="fixed"
      sx={{
        display: 'flex',
        width: navPosition === 'left' ? 'calc(100% - ' + sideMenuWidth + 'px)' : '100%',
        height: height,
        left: sideMenuWidth + 'px',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.5,
          ...sx
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Search />
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
          <ColorModeIconDropdown />
          <SettingsButton />
        </Stack>
      </Stack>
    </Stack>
  );
}
