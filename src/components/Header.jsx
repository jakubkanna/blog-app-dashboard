import { Grid } from "@mui/material";
import Logout from "./Logout";
import usePermissions from "../utils/usePermissions";

export default function Header() {
  const { isLoggedIn } = usePermissions();

  return (
    <header>
      <nav>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Grid item>
            <h1 className="brandname">Admin Dashboard</h1>
          </Grid>
          <Grid item>
            <ul
              className="menu"
              style={{ listStyleType: "none", margin: 0, padding: 0 }}>
              {isLoggedIn && (
                <li className="menu-item">
                  <Logout />
                </li>
              )}
            </ul>
          </Grid>
        </Grid>
      </nav>
    </header>
  );
}
