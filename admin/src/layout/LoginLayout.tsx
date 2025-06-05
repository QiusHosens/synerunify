import { Stack } from "@mui/material";
import SettingsButton from "@/components/SettingsButton";
import { styled } from '@mui/material/styles';
import Language from "./MainLayout/Language";

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignInContainer direction="column" justifyContent="space-between">
        <Stack direction="row" sx={{ gap: 1, position: 'fixed', top: '1rem', right: '1rem' }}>
          <Language />
          <SettingsButton />
        </Stack>
        {/* <SettingsButton sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
        {children}
      </SignInContainer>
    </>
    // </AppTheme>
  );
}
