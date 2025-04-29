import { ButtonProps } from '@mui/material/Button';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    operate: true;
  }
}