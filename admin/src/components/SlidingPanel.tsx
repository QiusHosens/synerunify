import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box } from '@mui/material';

interface SlidingPanelProps {
  height?: string | number;
  toggleButtonEl?: HTMLElement | null;
  followElement?: HTMLElement | null;
  children?: React.ReactNode;
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  height = '18.75rem',
  toggleButtonEl,
  followElement,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const toPx = (rem: number): number => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  };

  const parseHeight = (height: string | number): number => {
    if (typeof height === 'number') return height;
    if (typeof height !== 'string') return toPx(18.75);

    if (height.endsWith('%')) {
      const percentage = parseFloat(height) / 100;
      return Math.floor(window.innerHeight * percentage);
    }
    if (height.endsWith('rem')) {
      return toPx(parseFloat(height));
    }
    if (height.endsWith('px')) {
      return parseInt(height);
    }
    return toPx(18.75);
  };

  const maxHeight = useMemo(() => parseHeight(height), [height]);
  const bottomMargin = useMemo(() => toPx(0.5), []);
  const buttonOffset = useMemo(() => toPx(0.625), []);
  const maxPosition = useMemo(() => bottomMargin, [bottomMargin]);
  const minPosition = useMemo(() => -maxHeight, [maxHeight]);

  const panelStyle = {
    bottom: `${currentY}px`,
    height: `${maxHeight}px`,
    zIndex: 1000
  };

  const startDragging = (e: React.MouseEvent | React.TouchEvent): void => {
    setIsDragging(true);
    setStartY('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY);
    setCurrentY(parseFloat(panelRef.current?.style.bottom || '0') || minPosition);
    
    const header = panelRef.current?.querySelector('.panel-header') as HTMLElement;
    if (header) {
      header.style.cursor = 'grabbing';
      setHeaderHeight(header.offsetHeight);
    }
  };

  const startDraggingNative = (e: Event): void => {
    const evt = e as MouseEvent | TouchEvent;
    setIsDragging(true);
    setStartY('touches' in evt ? evt.touches[0].clientY : (evt as MouseEvent).clientY);
    setCurrentY(parseFloat(panelRef.current?.style.bottom || '0') || minPosition);
    
    const header = panelRef.current?.querySelector('.panel-header') as HTMLElement;
    if (header) {
      header.style.cursor = 'grabbing';
      setHeaderHeight(header.offsetHeight);
    }
  };

  const drag = (e: MouseEvent | TouchEvent): void => {
    if (!isDragging) return;
    e.preventDefault();
    
    const y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    let newPosition = window.innerHeight - y - maxHeight + headerHeight;
    newPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));
    
    setCurrentY(newPosition);
    updateFollowElement(newPosition);
  };

  const stopDragging = (): void => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const header = panelRef.current?.querySelector('.panel-header') as HTMLElement;
    if (header) header.style.cursor = 'grab';

    const newPosition = currentY > (maxPosition + minPosition) / 2 
      ? maxPosition 
      : minPosition;
    setCurrentY(newPosition);
    updateFollowElement(newPosition);
  };

  const show = (): void => {
    setCurrentY(maxPosition);
    updateFollowElement(maxPosition);
  };

  const hide = (): void => {
    setCurrentY(minPosition);
    updateFollowElement(minPosition);
  };

  const toggle = (): void => {
    currentY >= maxPosition ? hide() : show();
  };

  const updateFollowElement = (position = currentY): void => {
    if (followElement) {
      followElement.style.bottom = `${position + maxHeight + buttonOffset}px`;
    }
  };

  useEffect(() => {
    setCurrentY(minPosition);
    updateFollowElement(minPosition);

    const header = panelRef.current?.querySelector('.panel-header') as HTMLElement;
    if (header) {
      header.addEventListener('mousedown', startDraggingNative);
      header.addEventListener('touchstart', startDraggingNative);
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    return () => {
      if (header) {
        header.removeEventListener('mousedown', startDraggingNative);
        header.removeEventListener('touchstart', startDraggingNative);
      }
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
    };
  }, []);

  useEffect(() => {
    if (toggleButtonEl) {
      toggleButtonEl.addEventListener('click', toggle);
      return () => toggleButtonEl.removeEventListener('click', toggle);
    }
  }, [toggleButtonEl]);

  useEffect(() => {
    if (followElement) {
      updateFollowElement();
    }
  }, [followElement]);

  return (
    <Box>
      <Box
        ref={panelRef}
        sx={{
          position: 'fixed',
          left: '1rem',
          right: '1rem',
          width: 'calc(100% - 2rem)',
          bgcolor: 'white',
          boxShadow: '0 -0.125rem 0.625rem rgba(0, 0, 0, 0.2)',
          transition: 'bottom 0.3s ease-out',
          touchAction: 'none',
          borderRadius: '0.5rem 0.5rem 0 0',
          '@media (max-width: 768px)': {
            fontSize: '14px'
          },
          ...panelStyle
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SlidingPanel;

// example
{/* <SlidingPanel
  height="20rem"
  toggleButtonEl={someButtonElement}
  followElement={someFollowElement}
>
  <Box 
    className="panel-header"
    sx={{
      height: '2.5rem',
      bgcolor: '#f0f0f0',
      cursor: 'grab',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      borderRadius: '0.5rem 0.5rem 0 0'
    }}
  >
    Drag me
  </Box>
  <Box 
    className="panel-content"
    sx={{ p: '1.25rem' }}
  >
    Content here
  </Box>
</SlidingPanel> */}