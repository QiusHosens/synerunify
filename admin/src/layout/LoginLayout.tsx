import { Box } from '@mui/material';
import SettingsButton from '@/components/SettingsButton';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      className="center-align"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      {children}
      <SettingsButton />
    </Box>
  );
}