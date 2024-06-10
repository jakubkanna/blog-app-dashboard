import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";
import Posts from "./pages/Posts.jsx";
import Comments from "./pages/Comments.jsx";
import Settings from "./pages/Settings.jsx";
import usePermissions from "./hooks/usePermissions.js";
import Editor from "./components/Editor.jsx";
import { EditorContextProvider } from "./context/EditorContext.jsx";

const ProtectedAdmin = () => {
  const { isAdmin, isLoading } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to={"/"} />;
};

const EditorWithContext = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const storageKey = currentPath;
  const { id } = useParams();
  const isUpdatePath = currentPath.includes(id);

  return (
    <EditorContextProvider storageKey={storageKey}>
      <Editor isUpdateUrl={isUpdatePath} idParam={id} />
    </EditorContextProvider>
  );
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
                element: <EditorWithContext />,
              },
              {
                path: "update/:id",
                element: <EditorWithContext />,
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
