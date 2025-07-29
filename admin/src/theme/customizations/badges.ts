import { alpha, Theme, Components } from "@mui/material/styles";

export const badgesCustomizations: Components<Theme> = {
  MuiBadge: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: '#637381',
        "&.customQuestionBadge": {
          //   display: "flex",
          //   alignItems: "center",
          marginRight: theme.spacing(2),
        },
      }),
      badge: ({ theme }) => ({
        variants: [
          {
            props: {
              color: "primary",
              variant: "customQuestion",
            },
            style: {
              //   position: "relative",
              //   transform: "unset",
              transform: "scale(1) translate(100%, -20%)",
              fontSize: "0.75rem",
              minWidth: "16px",
              height: "16px",
              padding: "0 4px",
              ...theme.applyStyles("dark", {}),
            },
          },
        ],
      }),
    },
  },
};
