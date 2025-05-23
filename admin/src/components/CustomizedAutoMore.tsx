import { Box, Button, Popover } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import MoreIcon from '@/assets/image/svg/more.svg';
import { useTranslation } from "react-i18next";

interface CustomizedAutoMoreProps {
  maxCount?: number;
  children: ReactNode;
}

const CustomizedAutoMore = ({ maxCount, children }: CustomizedAutoMoreProps) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'custom-popover' : undefined;

  const count = maxCount ?? 2;
  const [outterEl, setOutterEl] = useState<ReactNode>();
  const [moreEl, setMoreEl] = useState<ReactNode>();

  useEffect(() => {
    if (Array.isArray(children)) {
      if (children.length <= count) {
        setOutterEl(children);
        setMoreEl(null);
      } else {
        const outter = children.slice(0, count - 1);
        const more = children.slice(count - 1, children.length);
        setOutterEl(outter);
        setMoreEl(more);
      }
    } else {
      setOutterEl(children);
      setMoreEl(null);
    }
  }, [children]);

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
      {outterEl}
      {moreEl && <>
        <Button
          size="small"
          variant='customOperate'
          title={t('global.operate.more')}
          aria-describedby={popoverId}
          startIcon={<MoreIcon />}
          onClick={handleMoreClick}
        />
        <Popover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleMoreClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPopover-paper': {
              p: 1,
              ml: -1
            }
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', gap: 1, flexDirection: 'column' }}>
            {moreEl}
          </Box>
        </Popover>
      </>}
    </Box>
  )
}

export default CustomizedAutoMore;