import AppTheme from "@/theme/AppTheme";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SideMenu from "./SideMenu";
import { useAuthStore, useHomeStore, useThemeStore } from "@/store";
import { useEffect } from "react";
import Header from "./Header";
import TopMenu from "./TopMenu";
import BottomMenu from "./BottomMenu";

const xThemeComponents = {};

interface LayoutProps {
  children?: React.ReactNode; // 添加 children 属性
}

export default function Layout({ children }: LayoutProps) {

  const { navPosition } = useThemeStore();
  const headerHeight = 72; // 固定顶部导航栏高度
  const topMenuHeight = 64; // 顶部导航栏高度
  const bottomMenuHeight = 72; // 底部导航栏高度
  const sideMenuWidth = 288; // 左侧导航栏宽度

  const { access_token } = useAuthStore();
  const { nickname, routes, routeTree, fetchAndSetHome } = useHomeStore();

  const isVertical = navPosition === 'top' || navPosition === 'bottom';
  const layoutStyles = {
    position: 'relative',
    display: 'flex',
    flexDirection: navPosition === 'left' ? 'row' : navPosition === 'top' ? 'column' : navPosition === 'bottom' ? 'column' : '',
    minHeight: '100vh',
    width: '100%',
  };

  useEffect(() => {
    fetchAndSetHome(access_token);
  }, [access_token, fetchAndSetHome]);

  return (
    <>
      {/* <AppTheme themeComponents={xThemeComponents}> */}

      {/* <CssBaseline enableColorScheme /> */}

      <Box sx={layoutStyles}>
        {
          navPosition === 'left' ?
            (
              <SideMenu routeTree={routeTree} sx={{
                mt: 0,
                height: '100%'
              }} sideMenuWidth={sideMenuWidth}></SideMenu>
            )
            : navPosition === 'top' ?
              (
                <TopMenu sx={{
                  mt: headerHeight + 'px',
                  height: topMenuHeight + 'px'
                }} routeTree={routeTree}></TopMenu>
              )
              :
              (
                <BottomMenu sx={{
                  bottom: '1.5rem',
                  height: bottomMenuHeight + 'px'
                }} routeTree={routeTree}></BottomMenu>
              )
        }
        <Header sideMenuWidth={sideMenuWidth} height={headerHeight} routeTree={routeTree}></Header>
      </Box>

      {/* </AppTheme> */}
    </>
  );
}
