import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  styled,
  useTheme,
  alpha,
} from '@mui/material';

// 类型定义
export interface AnchorLinkProps {
  href: string;
  title: React.ReactNode;
  children?: AnchorLinkProps[];
  className?: string;
}

export interface CustomizedAnchorProps {
  /**
   * 锚点链接列表
   */
  items?: AnchorLinkProps[];
  /**
   * 滚动偏移量，默认为 0
   */
  offsetTop?: number;
  /**
   * 锚点区域边界，默认为 5px
   */
  bounds?: number;
  /**
   * 是否显示墨点
   */
  showInkInFixed?: boolean;
  /**
   * 设置锚点滚动容器
   */
  getContainer?: () => HTMLElement | Window;
  /**
   * 点击锚点时的回调
   */
  onClick?: (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => void;
  /**
   * 锚点改变时的回调
   */
  onChange?: (currentActiveLink: string) => void;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 替换跳转链接的内容
   */
  replace?: (href: string) => string;
  /**
   * 是否显示为固定模式（带边框和背景）
   */
  fixed?: boolean;
  /**
   * 固定模式时的位置
   */
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// 样式化组件
const StyledAnchorContainer = styled(Paper)<{ fixed?: boolean }>(({ theme, fixed }) => ({
  ...(fixed && {
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    maxHeight: '60vh',
    overflow: 'auto',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: 'blur(8px)',
  }),
  ...(!fixed && {
    position: 'relative',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: 0,
  }),
}));

const StyledInkBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: 0,
  width: 2,
  backgroundColor: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  borderRadius: 1,
}));

const StyledAnchorList = styled(List)(({ theme }) => ({
  padding: 0,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: theme.palette.divider,
  },
}));

const StyledAnchorListItem = styled(ListItem)<{ active?: boolean; level?: number }>(
  ({ theme, active, level = 0 }) => ({
    padding: 0,
          paddingLeft: theme.spacing(level * 2),
    position: 'relative',
    
    '& .MuiListItemButton-root': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      borderRadius: 0,
      transition: 'all 0.2s ease',
      
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        color: theme.palette.primary.main,
      },
      
      ...(active && {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        fontWeight: 600,
      }),
    },
    
    '& .MuiListItemText-primary': {
      fontSize: level === 0 ? '0.875rem' : '0.8125rem',
      lineHeight: 1.5,
      ...(active && {
        fontWeight: 600,
      }),
    },
  })
);

// AnchorLink 子组件
export const AnchorLink: React.FC<AnchorLinkProps> = ({ href, title, children }) => {
  // 这是一个纯展示组件，实际的渲染逻辑在主组件中处理
  return null;
};

// 主组件
const CustomizedAnchor: React.FC<CustomizedAnchorProps> = ({
  items = [],
  offsetTop = 0,
  bounds = 5,
  showInkInFixed = true,
  getContainer,
  onClick,
  onChange,
  className,
  style,
  replace,
  fixed = false,
  position = { top: 100, right: 20 },
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const inkBarRef = useRef<HTMLDivElement>(null);
  const [activeLink, setActiveLink] = useState<string>('');
  const [inkBarStyle, setInkBarStyle] = useState<{ top: number; height: number }>({
    top: 0,
    height: 0,
  });

  // 获取滚动容器
  const scrollContainer = useMemo(() => {
    if (getContainer) {
      return getContainer();
    }
    return window;
  }, [getContainer]);

  // 获取所有锚点元素和链接
  const getAllLinks = useCallback((linkItems: AnchorLinkProps[]): string[] => {
    const links: string[] = [];
    linkItems.forEach((item) => {
      links.push(item.href);
      if (item.children) {
        links.push(...getAllLinks(item.children));
      }
    });
    return links;
  }, []);

  const allLinks = useMemo(() => getAllLinks(items), [items, getAllLinks]);

  // 处理锚点点击
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string, title: React.ReactNode) => {
      e.preventDefault();
      
      const targetHref = replace ? replace(href) : href;
      
      // 触发点击回调
      if (onClick) {
        onClick(e, { title, href: targetHref });
      }

      // 获取目标元素
      const targetId = targetHref.replace('#', '');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const container = scrollContainer;
        const scrollTop = container === window 
          ? window.pageYOffset || document.documentElement.scrollTop
          : (container as HTMLElement).scrollTop;
        
        const targetTop = container === window
          ? targetElement.getBoundingClientRect().top + scrollTop
          : targetElement.offsetTop;
        
        const scrollToTop = targetTop - offsetTop;
        
        // 平滑滚动
        if (container === window) {
          window.scrollTo({
            top: scrollToTop,
            behavior: 'smooth',
          });
        } else {
          (container as HTMLElement).scrollTo({
            top: scrollToTop,
            behavior: 'smooth',
          });
        }
      }
    },
    [onClick, replace, scrollContainer, offsetTop]
  );

  // 计算当前活动的锚点
  const getCurrentActiveLink = useCallback(() => {
    const container = scrollContainer;
    const scrollTop = container === window 
      ? window.pageYOffset || document.documentElement.scrollTop
      : (container as HTMLElement).scrollTop;

    let currentActiveLink = '';
    let minDistance = Infinity;

    allLinks.forEach((href) => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      
      if (element) {
        const elementTop = container === window
          ? element.getBoundingClientRect().top + scrollTop
          : element.offsetTop;
        
        const distance = Math.abs(elementTop - scrollTop - offsetTop);
        
        if (distance < minDistance && distance <= bounds) {
          minDistance = distance;
          currentActiveLink = href;
        }
      }
    });

    return currentActiveLink;
  }, [allLinks, scrollContainer, offsetTop, bounds]);

  // 更新墨点位置
  const updateInkBar = useCallback((activeHref: string) => {
    if (!showInkInFixed || !containerRef.current) return;

    const activeElement = containerRef.current.querySelector(
      `[data-href="${activeHref}"]`
    ) as HTMLElement;

    if (activeElement) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      const top = activeRect.top - containerRect.top;
      const height = activeRect.height;

      setInkBarStyle({ top, height });
    }
  }, [showInkInFixed]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const currentActive = getCurrentActiveLink();
      if (currentActive !== activeLink) {
        setActiveLink(currentActive);
        updateInkBar(currentActive);
        
        if (onChange) {
          onChange(currentActive);
        }
      }
    };

    const container = scrollContainer;
    
    if (container === window) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      (container as HTMLElement).addEventListener('scroll', handleScroll, { passive: true });
    }

    // 初始化
    handleScroll();

    return () => {
      if (container === window) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        (container as HTMLElement).removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollContainer, getCurrentActiveLink, activeLink, updateInkBar, onChange]);

  // 渲染锚点链接
  const renderAnchorItems = useCallback(
    (linkItems: AnchorLinkProps[], level: number = 0): React.ReactNode => {
      return linkItems.map((item, index) => (
        <React.Fragment key={`${level}-${index}-${item.href}`}>
          <StyledAnchorListItem
            active={activeLink === item.href}
            level={level}
            data-href={item.href}
          >
            <ListItemButton
              onClick={(e) => handleLinkClick(e, item.href, item.title)}
              className={item.className}
            >
              <ListItemText
                primary={
                  typeof item.title === 'string' ? (
                    <Typography component="span">{item.title}</Typography>
                  ) : (
                    item.title
                  )
                }
              />
            </ListItemButton>
          </StyledAnchorListItem>
          
          {item.children && item.children.length > 0 && (
            renderAnchorItems(item.children, level + 1)
          )}
        </React.Fragment>
      ));
    },
    [activeLink, handleLinkClick]
  );

  const containerStyle = fixed
    ? {
        ...style,
        top: position.top,
        right: position.right,
        bottom: position.bottom,
        left: position.left,
      }
    : style;

  return (
    <StyledAnchorContainer
      ref={containerRef}
      fixed={fixed}
      className={className}
      style={containerStyle}
      elevation={fixed ? 4 : 0}
    >
      <Box position="relative">
        {showInkInFixed && fixed && (
          <StyledInkBar
            ref={inkBarRef}
            style={{
              top: inkBarStyle.top,
              height: inkBarStyle.height,
            }}
          />
        )}
        
        <StyledAnchorList>
          {renderAnchorItems(items)}
        </StyledAnchorList>
      </Box>
    </StyledAnchorContainer>
  );
};

export default CustomizedAnchor;
