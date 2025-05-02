import { alpha, Theme, Components } from "@mui/material/styles";

export const dataGridsCustomizations: Components<Theme> = {
  MuiDataGrid: {
    styleOverrides: {
      cell: ({ theme }) => ({
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
