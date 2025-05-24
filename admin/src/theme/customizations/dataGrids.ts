import { Theme, Components } from "@mui/material/styles";
import type {} from '@mui/x-data-grid/themeAugmentation';

export const dataGridsCustomizations: Components<Theme> = {
  MuiDataGrid: {
    styleOverrides: {
      cell: () => ({
        ':focus': {
            outline: 'none',
        },
        ':focus-within': {
            outline: 'none',
        }
      }),
    },
  },
};
