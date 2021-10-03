import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";


export default function Nav() {
  return (
    <div>
      <Breadcrumbs aria-label="Navigation">
        <Link underline="hover" color="inherit" href="/">
          Главная
        </Link>

        <Typography color="text.primary">Задача</Typography>
      </Breadcrumbs>
    </div>
  );
}
