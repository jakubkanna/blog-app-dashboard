import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
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
        navigate("/admin/dashboard");
      }
    }
  }, [isLoggedIn, isAdmin, navigate]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <p>You are logged in.</p>
          <Logout />
        </>
      ) : (
        <>
          <Header />
          <div className="container">
            <div className="container-header">
              <h1>Login</h1>
            </div>
            <div className="container-body">
              <LoginForm />
            </div>
            <div className="container-footer"></div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
