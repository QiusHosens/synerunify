import AppTheme from "@/theme/AppTheme";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SideMenu from "./SideMenu";
import { useAuthStore, useHomeStore, useThemeStore } from "@/store";
import { useEffect } from "react";

const xThemeComponents = {};

export default function Layout(props: { disableCustomTheme?: boolean }) {

    const { navPosition } = useThemeStore();
      const topFixedNavHeight = 72; // 固定顶部导航栏高度
      const topNavHeight = 64; // 顶部导航栏高度
      const bottomNavHeight = 72; // 底部导航栏高度
      const leftNavWidth = 288; // 左侧导航栏宽度
    
      const { access_token } = useAuthStore();
      const { nickname, routes, routeTree, fetchAndSetHome } = useHomeStore();
    
      const isVertical = navPosition === 'top' || navPosition === 'bottom';
      const layoutStyles = {
        position: 'relative',
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        minHeight: '100vh',
        width: '100%',
      };
    
      useEffect(() => {
        fetchAndSetHome(access_token);
      }, [access_token, fetchAndSetHome]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={layoutStyles}>
        {
                  navPosition === 'left' ? <SideMenu sx={{
                    mt: 0,
                    height: '100%'
                  }} routeTree={routeTree}></SideMenu>
                    : navPosition === 'top' ? <TopNavigation sx={{
                      mt: topFixedNavHeight + 'px',
                      height: topNavHeight + 'px'
                    }} routeTree={routeTree}></TopNavigation> : <BottomNavigation sx={{
                      bottom: '24px',
                      height: bottomNavHeight + 'px'
                    }} routeTree={routeTree}></BottomNavigation>
                }
      </Box>
    </AppTheme>
  );
}
