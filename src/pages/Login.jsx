import LoginForm from "../components/FormLogin";
import Logout from "../components/Logout";
import usePermissions from "../lib/usePermissions";

export default function Login() {
  const { isLoggedIn } = usePermissions();

  return (
    <>
      {isLoggedIn ? (
        <>
          <p>You are already logged in.</p>
          <Logout />
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
