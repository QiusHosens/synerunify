import Box from "@mui/material/Box";
import SideMenu from "./SideMenu";
import { useDictStore, useThemeStore } from "@/store";
import { useEffect, useRef } from "react";
import Header from "./Header";
import TopMenu from "./TopMenu";
import BottomMenu from "./BottomMenu";
import MainGrid from "./MainGrid";
import { HomeMenuResponse } from "@/api";

interface LayoutProps {
  routeTree: HomeMenuResponse[]; // 路由树
  children?: React.ReactNode; // 添加 children 属性
}

export default function Layout({ routeTree, children }: LayoutProps) {

  const { navPosition } = useThemeStore();
  const headerHeight = 72; // 固定顶部导航栏高度
  const topMenuHeight = 64; // 顶部导航栏高度
  const bottomMenuHeight = 72; // 底部导航栏高度
  const sideMenuWidth = 288; // 左侧导航栏宽度

  const { fetchAndSetDict } = useDictStore();

  const hasInit = useRef(false);

  const layoutStyles = {
    position: 'relative',
    display: 'flex',
    flexDirection: navPosition === 'left' ? 'row' : navPosition === 'top' ? 'column' : navPosition === 'bottom' ? 'column' : '',
    minHeight: '100vh',
    width: '100%',
  };

  useEffect(() => {
    if (hasInit.current) {
      return;
    }
    hasInit.current = true;
    fetchAndSetDict();
  }, []);

  return (
    <>
      <Box sx={layoutStyles}>
        {
          navPosition === 'left' ?
            (
              <Box sx={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'row',
              }}>
                <SideMenu routeTree={routeTree} sx={{
                  mt: 0,
                  height: '100%'
                }} sideMenuWidth={sideMenuWidth}></SideMenu>
                <Box sx={{
                  width: `calc(100% - ${sideMenuWidth}px)`,
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Header height={headerHeight} routeTree={routeTree}></Header>
                  <MainGrid headerHeight={headerHeight} topMenuHeight={topMenuHeight} children={children} />
                </Box>
              </Box>
            )
            : navPosition === 'top' ?
              (
                <Box sx={{
                  width: '100%',
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Header height={headerHeight} routeTree={routeTree}></Header>
                  <TopMenu sx={{
                    // mt: headerHeight + 'px',
                    height: topMenuHeight + 'px'
                  }} routeTree={routeTree}></TopMenu>
                  <MainGrid headerHeight={headerHeight} topMenuHeight={topMenuHeight} children={children} />
                </Box>
              )
              :
              (
                <Box sx={{
                  width: '100%',
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Header height={headerHeight} routeTree={routeTree}></Header>
                  <MainGrid headerHeight={headerHeight} topMenuHeight={topMenuHeight} children={children} />
                  <BottomMenu sx={{
                    bottom: '1.5rem',
                    height: bottomMenuHeight + 'px'
                  }} routeTree={routeTree}></BottomMenu>
                </Box>
              )
        }

      </Box>

      {/* </AppTheme> */}
    </>
  );
}
