import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";
import Posts from "./pages/Posts.jsx";
import Comments from "./pages/Comments.jsx";
import Settings from "./pages/Settings.jsx";
import usePermissions from "./lib/usePermissions.js";
import Create from "./pages/Create.jsx";

const ProtectedAdmin = () => {
  const { isAdmin } = usePermissions();

  return isAdmin && <Outlet />;
};

const ProtectedUser = () => {
  const { isLoggedIn } = usePermissions();

  return isLoggedIn && <Outlet />;
};

const SettingsRoute = {
  path: "settings",
  element: <Settings />,
};

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <ProtectedAdmin />,
    children: [
      {
        path: "/admin",
        element: <App />,
        children: [
          {
            path: "posts",
            element: <Posts />,
            children: [
              {
                path: "create",
                element: <Create />,
              },
            ],
          },
          {
            path: "comments",
            element: <Comments />,
          },
          SettingsRoute,
        ],
      },
    ],
  },
  {
    element: <ProtectedUser />,
    children: [
      {
        path: "/user",
        element: <App />,
        children: [SettingsRoute],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
