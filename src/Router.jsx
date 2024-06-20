import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useParams,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";
import Posts from "./pages/Posts.jsx";
import Settings from "./pages/Settings.jsx";
import Events from "./pages/Events.jsx";
import Works from "./pages/Works.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import usePermissions from "./hooks/usePermissions.js";
import Editor from "./components/editor/Editor.jsx";
import { EditorContextProvider } from "./contexts/EditorContext.jsx";
import PageContainer from "./components/PageContainer.jsx";
import { EventsProvider } from "./contexts/EventsContext.tsx";

const ProtectedAdmin = () => {
  const { isAdmin, isLoading } = usePermissions();
  isLoading && <div>Loading...</div>;
  return isAdmin ? <Outlet /> : <Login />;
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
        element: <App />,
        children: [
          {
            element: <PageContainer title="Dashboard" />,
            children: [
              { path: "dashboard", element: <Dashboard />, name: "Dashboard" },
            ],
          },
          {
            element: <PageContainer title="Events" />,
            children: [
              {
                path: "events",
                element: (
                  <EventsProvider>
                    <Events />
                  </EventsProvider>
                ),
                name: "Events",
              },
            ],
          },
          {
            element: <PageContainer title="Works" />,
            children: [{ path: "works", element: <Works />, name: "Works" }],
          },
          {
            path: "posts",
            element: <PageContainer title="Posts" />,
            name: "Posts",
            children: [
              { path: "", element: <Posts /> },
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
            element: <PageContainer title="Settings" />,
            children: [
              { path: "settings", element: <Settings />, name: "Settings" },
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
