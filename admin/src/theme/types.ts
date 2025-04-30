import { ButtonProps } from '@mui/material/Button';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    customContained: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    customOperate: true;
  }
}