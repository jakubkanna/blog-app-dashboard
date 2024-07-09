import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const usePermissions = () => {
  const { user } = useContext(AuthContext);

  if (!user) return false;

  const isLoggedIn = !!user;

  return { isLoggedIn };
};

export default usePermissions;
