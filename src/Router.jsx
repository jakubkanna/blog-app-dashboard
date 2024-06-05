import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";
import Posts from "./pages/Posts.jsx";
import Comments from "./pages/Comments.jsx";
import Settings from "./pages/Settings.jsx";
import usePermissions from "./hooks/usePermissions.js";
import Editor from "./components/Editor.jsx";

const ProtectedAdmin = () => {
  const { isAdmin, isLoading } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to={"/"} />;
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
    path: "/admin",
    element: <ProtectedAdmin />,
    children: [
      {
        path: "",
        element: <App />,
        children: [
          {
            path: "posts",
            element: <Posts />,
            children: [
              {
                path: "create",
                element: <Editor />,
              },
              {
                path: "update/:id",
                element: <Editor />,
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
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
