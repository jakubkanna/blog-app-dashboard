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
import Events from "./pages/Events.jsx";
import Works from "./pages/Works.jsx";
import usePermissions from "./hooks/usePermissions.js";
import Editor from "./components/Editor.jsx";
import { EditorContextProvider } from "./context/EditorContext.jsx";

const ProtectedAdmin = () => {
  const { isAdmin, isLoading } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin && <Outlet />;
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
            path: "events",
            element: <Events />,
            name: "Events",
          },
          {
            path: "works",
            element: <Works />,
            name: "Works",
          },
          {
            path: "posts",
            element: <Posts />,
            name: "Posts",
            children: [
              {
                path: "create",
                element: <EditorWithContext />,
                name: "Create Post",
              },
              {
                path: "update/:id",
                element: <EditorWithContext />,
                name: "Update Post",
              },
            ],
          },
          {
            path: "comments",
            element: <Comments />,
            name: "Comments",
          },
          {
            path: "settings",
            element: <Settings />,
            name: "Settings",
          },
        ],
      },
    ],
  },
];

const extractSidebarRoutes = (routes) => {
  let sidebarRoutes = [];

  routes.forEach((route) => {
    if (route.path === "/admin" && route.children) {
      route.children.forEach((child) => {
        child.children.forEach((subChild) => {
          sidebarRoutes.push({ path: subChild.path, name: subChild.name });
        });
      });
    }
  });
  return sidebarRoutes;
};

export const sidebarRoutes = extractSidebarRoutes(routes);

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
