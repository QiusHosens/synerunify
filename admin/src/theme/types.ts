import { ButtonProps } from '@mui/material/Button';

// button custom variant
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

declare module '@mui/material/Badge' {
  interface BadgePropsVariantOverrides {
    customQuestion: true;
  }
}