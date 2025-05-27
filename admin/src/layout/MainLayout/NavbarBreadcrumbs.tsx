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
    color: theme.palette.action.disabled,
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
  const [activeRoutes, setActiveRoutes] = useState<HomeMenuResponse[]>([]);

  useEffect(() => {
    const routes: HomeMenuResponse[] = [];
    const findActiveRoute = (items: HomeMenuResponse[] | undefined) => {
      if (!items) {
        return;
      }
      items.forEach((item) => {
        if (isRouteActive(item.path, location.pathname, item.children)) {
          routes.push(item);
        }
        findActiveRoute(item.children);
      });
    };
    // debugger
    findActiveRoute(routeTree);
    setActiveRoutes(routes)
    // console.log('active routes', routes);
  }, [routeTree, location.pathname]);

  const handleClickPath = (path: string) => {
    navigate(path)
  };

  const handleClick = (item: HomeMenuResponse) => {
    if (canClick(item)) {
      navigate(item.path)
    }
  };

  const canClick = (item: HomeMenuResponse) => {
    return item.type == 2;
  };

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => handleClickPath('/')}>Home</Typography>
      {
        activeRoutes.map((item) => {
          return (
            <Typography variant="body1" key={item.path} sx={{ color: 'text.primary', cursor: (canClick(item) ? 'pointer' : 'default'), fontWeight: 400 }} onClick={() => handleClick(item)} >
              {item.name}
            </Typography>
          )
        })
      }
    </StyledBreadcrumbs >
  );
}
