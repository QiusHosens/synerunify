import { useState } from 'react';
import { Badge, IconButton, Menu, SvgIcon } from '@mui/material';
import ContactIcon from '@/assets/image/svg/contacts.svg';

const Contact = () => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleNotificationClick}
      >
        <Badge
          color="error"
          badgeContent={4}
        >
          <SvgIcon sx={{ borderRadius: '6px', height: 'auto' }} fontSize='small' inheritViewBox component={ContactIcon} />
        </Badge>
      </IconButton >

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiMenu-paper': { p: 0.5 }, '& .MuiList-root': { pt: 0, pb: 0 } }}
      ></Menu>
    </>
  )
}

export default Contact;