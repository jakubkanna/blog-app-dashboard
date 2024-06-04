import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/FormLogin";
import Logout from "../components/Logout";
import usePermissions from "../hooks/usePermissions";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const { isLoggedIn, isAdmin } = usePermissions();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [isLoggedIn, isAdmin, navigate]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <p>You are already logged in.</p>
          <Logout />
        </>
      ) : (
        <>
          <Header />
          <LoginForm />
          <Footer />
        </>
      )}
    </>
  );
}
