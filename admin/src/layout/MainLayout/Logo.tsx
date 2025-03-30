import { Typography } from "@mui/material";

export default function Logo() {
  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Logo
      </Typography>
    </>
  );
}
