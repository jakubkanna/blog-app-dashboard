import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const usePermissions = () => {
  const { user } = useContext(AuthContext);

  if (!user) return false;

  const isAdmin = user && user.role === "admin";

  const isLoggedIn = !!user;

  return { isLoggedIn, isAdmin };
};

export default usePermissions;
