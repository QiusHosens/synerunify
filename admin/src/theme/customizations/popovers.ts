import { alpha, Theme, Components } from "@mui/material/styles";

export const popoversCustomizations: Components<Theme> = {
  // MuiPaper: {
  //   styleOverrides: {
  //     root: ({ theme }) => ({
  //       "&.MuiPopover-paper": {
  //         boxShadow: "none",
  //       },
  //     }),
  //   },
  // },
  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }) => ({
        // padding: '8px',
        // marginLeft: '-8px',
        // // boxShadow: theme.shadows[2],
        // // boxShadow: '0px 0px 0px -3px rgba(0,0,0,0.2),0px 0px 0px 0px rgba(0,0,0,0.14),0px 0px 14px 2px rgba(0,0,0,0.12)',
        // // boxShadow: '0 0 2px 0 rgba(145 158 171 / 0.24),-20px 20px 40px -4px rgba(145 158 171 / 0.24)',
        // boxShadow: '0px 0px 0px -3px rgba(145 158 171 / 0.24),0px 0px 0px 0px rgba(145 158 171 / 0.24),0px 2px 6px -3px rgba(145 158 171 / 0.24)',
      }),
    },
  },
};
