import { Button, Popover } from "@mui/material";
import { useState } from "react";
import MoreIcon from '@/assets/image/svg/more.svg';

interface CustomizedMoreProps {
  children: React.ReactNode;
}

const CustomizedMore = ({ children }: CustomizedMoreProps) => {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'custom-popover' : undefined;

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        size="small"
        variant='customOperate'
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
      >
        {children}
      </Popover>
    </>
  )
}

export default CustomizedMore;