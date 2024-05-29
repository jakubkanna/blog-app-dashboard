import { UnprotectedPath, UserPath, AdminPath } from "./routes";

// Mock
const isLoggedIn = true;
const isAdmin = true;

const getRoutes = () => {
  return !isLoggedIn ? UnprotectedPath : isAdmin ? AdminPath : UserPath;
};

export default getRoutes;
