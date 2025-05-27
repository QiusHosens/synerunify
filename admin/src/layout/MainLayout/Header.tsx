import { SxProps, Theme } from "@mui/material/styles";
import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';

import Search from './Search';
import SettingsButton from '@/components/SettingsButton';
import { HomeMenuResponse } from '@/api';
import Language from "./Language";
import Notification from "./Notification";

interface HeaderProps {
  sx?: SxProps<Theme>;
  height: number;
  routeTree: HomeMenuResponse[];
}

export default function Header({ sx, height, routeTree }: HeaderProps) {

  return (
    <Stack
      // position="fixed"
      sx={{
        // display: 'flex',
        width: '100%',
        height: height,
        // left: sideMenuWidth + 'px',
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
          pl: 3,
          pr: 3,
          ...sx
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs routeTree={routeTree} />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Search />
          <Language />
          <Notification />
          <SettingsButton />
        </Stack>
      </Stack>
    </Stack>
  );
}
