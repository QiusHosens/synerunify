import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { HomeMenuResponse } from '@/api';
import { useEffect, useState } from 'react';

interface NavbarBreadcrumbsProps {
  routeTree: HomeMenuResponse[];
}

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// 检查路由是否匹配或包含在子路由中
const isRouteActive = (routePath: string, currentPath: string, children?: HomeMenuResponse[]): boolean => {
  if (routePath === currentPath) return true;
  if (children) {
    return children.some((child) => isRouteActive(child.path, currentPath, child.children));
  }
  return false;
};

export default function NavbarBreadcrumbs({ routeTree }: NavbarBreadcrumbsProps) {

  const navigate = useNavigate();
  const location = useLocation();
  let [activeRoutes, setActiveRoutes] = useState<HomeMenuResponse[]>([]);

  useEffect(() => {
    let routes: HomeMenuResponse[] = [];
    const findActiveRoute = (items: HomeMenuResponse[]) => {
      items && items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          if (isRouteActive(item.path, location.pathname, item.children)) {
            routes.push(item);
          }
          findActiveRoute(item.children);
        }
      });
    };
    // debugger
    findActiveRoute(routeTree);
    setActiveRoutes(routes)
    console.log('active routes', routes);
    
  }, [routeTree, location.pathname]);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1" >Home</Typography>
      {activeRoutes.map((item) => {
        return (
          <Typography variant="body1" key={item.path} sx={{ color: 'text.primary', fontWeight: 600 }}>
            {item.name}
          </Typography>
        )
      })}
    </StyledBreadcrumbs>
  );
}
