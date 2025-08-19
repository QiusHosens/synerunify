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
  /** 锚点链接列表 */
  items?: AnchorLinkProps[];
  /** 滚动偏移量，默认为 0 */
  offsetTop?: number;
  /** 锚点区域边界，默认为 5px */
  bounds?: number;
  /** 是否显示墨点 */
  showInkInFixed?: boolean;
  /** 设置锚点滚动容器 */
  getContainer?: () => HTMLElement | Window;
  /** 点击锚点时的回调 */
  onClick?: (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => void;
  /** 锚点改变时的回调 */
  onChange?: (currentActiveLink: string) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 替换跳转链接的内容 */
  replace?: (href: string) => string;
  /** 是否显示为固定模式（带边框和背景） */
  fixed?: boolean;
  /** 固定模式时的位置 */
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// 样式化组件
const StyledAnchorContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'fixed',
})<{ fixed?: boolean }>(({ theme, fixed }) => ({
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

const StyledAnchorListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'level',
})<{ active?: boolean; level?: number }>(
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

/**
 * 更稳健地计算元素在滚动容器内容坐标系下的 top
 * 统一使用 getBoundingClientRect 差值 + scrollTop，避免 offsetParent 链条导致的误差。
 */
const getOffsetTopInContainer = (element: HTMLElement, container: HTMLElement): number => {
  const elRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return elRect.top - containerRect.top + container.scrollTop;
};

// AnchorLink 子组件（占位）
export const AnchorLink: React.FC<AnchorLinkProps> = ({ href, title, children }) => {
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
  const [inkBarStyle, setInkBarStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 });

  // 获取滚动容器
  const scrollContainer = useMemo(() => {
    if (getContainer) {
      return getContainer();
    }
    return window;
  }, [getContainer]);

  // 获取所有锚点链接（扁平化）
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

  // 点击滚动
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string, title: React.ReactNode) => {
      e.preventDefault();

      const targetHref = replace ? replace(href) : href;

      if (onClick) onClick(e, { title, href: targetHref });

      const targetId = targetHref.replace('#', '');
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;
      if (!scrollContainer) return;

      setTimeout(() => {
        const container = scrollContainer;
        let scrollToTop = 0;

        if (container === window) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetTop = targetElement.getBoundingClientRect().top + scrollTop;
          scrollToTop = Math.max(0, targetTop - offsetTop);
        } else {
          const containerElement = container as HTMLElement;
          if (!containerElement || !containerElement.contains(targetElement)) return;
          const elementOffsetTop = getOffsetTopInContainer(targetElement, containerElement);
          scrollToTop = Math.max(0, elementOffsetTop - offsetTop);
        }

        try {
          if (scrollContainer === window) {
            window.scrollTo({ top: scrollToTop, behavior: 'smooth' });
          } else {
            (scrollContainer as HTMLElement).scrollTo({ top: scrollToTop, behavior: 'smooth' });
          }
        } catch {
          /* noop */
        }
      }, 10);
    },
    [onClick, replace, scrollContainer, offsetTop]
  );

  // 计算当前激活的锚点（修复版）
  const getCurrentActiveLink = useCallback(() => {
    const container = scrollContainer;
    if (!container) return '';

    const isWindow = container === window;

    const scrollTop = isWindow
      ? window.pageYOffset || document.documentElement.scrollTop
      : (container as HTMLElement).scrollTop;

    const containerHeight = isWindow ? window.innerHeight : (container as HTMLElement).clientHeight;
    const scrollHeight = isWindow
      ? Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      )
      : (container as HTMLElement).scrollHeight;

    // 阈值：把 offsetTop 与 bounds 加到视口顶部一起比较
    const threshold = scrollTop + offsetTop + bounds;

    // 收集容器内有效锚点
    const anchors: Array<{ href: string; top: number; element: HTMLElement }> = [];

    for (const href of allLinks) {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (!el) continue;
      if (!isWindow && !(container as HTMLElement).contains(el)) continue; // 仅统计容器内元素

      const top = isWindow
        ? el.getBoundingClientRect().top + scrollTop
        : getOffsetTopInContainer(el, container as HTMLElement);

      anchors.push({ href, top, element: el });
    }

    if (anchors.length === 0) return '';

    anchors.sort((a, b) => a.top - b.top);

    // 处理接近底部的情况：激活最后一个
    if (scrollTop + containerHeight >= scrollHeight - 1) {
      return anchors[anchors.length - 1].href;
    }

    // 从上往下找到最后一个 top <= threshold 的锚点
    let active = anchors[0].href;
    for (const a of anchors) {
      if (a.top <= threshold) {
        active = a.href;
      } else {
        break;
      }
    }
    return active;
  }, [allLinks, scrollContainer, offsetTop, bounds]);

  // 更新墨点位置
  const updateInkBar = useCallback(
    (activeHref: string) => {
      if (!showInkInFixed || !containerRef.current || !activeHref) return;

      const activeElement = containerRef.current.querySelector(
        `[data-href="${activeHref}"]`
      ) as HTMLElement | null;

      if (!activeElement) return;

      const listElement = containerRef.current.querySelector('.MuiList-root') as HTMLElement | null;
      if (!listElement) return;

      try {
        const listRect = listElement.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        const top = activeRect.top - listRect.top;
        const height = activeRect.height;
        if (top >= 0 && height > 0) setInkBarStyle({ top, height });
      } catch {
        /* noop */
      }
    },
    [showInkInFixed]
  );

  // 滚动监听
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentActive = getCurrentActiveLink();
          if (currentActive !== activeLink) {
            setActiveLink(currentActive);
            updateInkBar(currentActive);
            if (onChange) onChange(currentActive);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const container = scrollContainer;
    if (!container) return;

    const opts: AddEventListenerOptions = { passive: true };

    if (container === window) {
      window.addEventListener('scroll', handleScroll, opts);
      window.addEventListener('resize', handleScroll, opts);
    } else {
      (container as HTMLElement).addEventListener('scroll', handleScroll, opts);
      // 容器尺寸变化也会影响计算
      const ro = new ResizeObserver(handleScroll);
      ro.observe(container as HTMLElement);
    }

    // 初始触发一次
    const initTimer = setTimeout(() => handleScroll(), 50);

    return () => {
      clearTimeout(initTimer);
      if (container === window) {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      } else {
        (container as HTMLElement).removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollContainer, getCurrentActiveLink, activeLink, updateInkBar, onChange]);

  // activeLink 变化时，更新墨点
  useEffect(() => {
    updateInkBar(activeLink);
  }, [activeLink, updateInkBar]);

  // 渲染锚点
  const renderAnchorItems = useCallback(
    (linkItems: AnchorLinkProps[], level: number = 0): React.ReactNode =>
      linkItems.map((item, index) => (
        <React.Fragment key={`${level}-${index}-${item.href}`}>
          <StyledAnchorListItem active={activeLink === item.href} level={level} data-href={item.href}>
            <ListItemButton onClick={(e) => handleLinkClick(e, item.href, item.title)} className={item.className}>
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
          {item.children && item.children.length > 0 && renderAnchorItems(item.children, level + 1)}
        </React.Fragment>
      )),
    [activeLink, handleLinkClick]
  );

  const containerStyle = fixed
    ? { ...style, top: position.top, right: position.right, bottom: position.bottom, left: position.left }
    : style;

  return (
    <StyledAnchorContainer ref={containerRef} fixed={fixed} className={className} style={containerStyle} elevation={fixed ? 4 : 0}>
      <Box position="relative">
        {/* {showInkInFixed && fixed && (
          <StyledInkBar ref={inkBarRef} style={{ top: inkBarStyle.top, height: inkBarStyle.height }} />
        )} */}
        {showInkInFixed && (
          <StyledInkBar ref={inkBarRef} style={{ top: inkBarStyle.top, height: inkBarStyle.height }} />
        )}
        <StyledAnchorList>{renderAnchorItems(items)}</StyledAnchorList>
      </Box>
    </StyledAnchorContainer>
  );
};

export default CustomizedAnchor;
