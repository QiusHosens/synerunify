import { Box, SvgIcon } from "@mui/material";
import Logo1 from '@/assets/logo_1.svg';

export default function Logo() {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SvgIcon component={Logo1} width={2031} height={599} inheritViewBox sx={{ width: 'auto', height: '63px' }} />
      </Box>
    </>
  );
}
