import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import Works from "./pages/Works";
import Dashboard from "./pages/Dashboard";
import usePermissions from "./utils/usePermissions";
import Editor from "./components/editor/Editor";
import PageContainer from "./components/PageContainer";
import { EventsProvider } from "./contexts/pagesContexts/EventsContext";
import { PostsProvider } from "./contexts/pagesContexts/PostsContext";
import { WorksProvider } from "./contexts/pagesContexts/WorksContext";

import Images from "./pages/Images";
import EventForm from "./components/EventForm";

const ProtectedAdmin = () => {
  const { isLoggedIn } = usePermissions();
  return isLoggedIn ? <Outlet /> : <Login />;
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
            element: <PageContainer title="Images" />,
            children: [{ path: "images", element: <Images />, name: "Images" }],
          },
          {
            element: (
              <WorksProvider>
                <PageContainer title="Works" />
              </WorksProvider>
            ),
            children: [
              {
                path: "works",
                element: <Works />,
                name: "Works",
              },
            ],
          },
          {
            path: "events",
            element: (
              <EventsProvider>
                <PageContainer title="Events" />
              </EventsProvider>
            ),
            name: "Events",
            children: [
              {
                path: "",
                element: <Events />,
              },
              {
                path: "update/:id",
                element: <EventForm />,
                name: "Update Event",
              },
            ],
          },
          {
            path: "posts",
            element: (
              <PostsProvider>
                <PageContainer title="Posts" />
              </PostsProvider>
            ),
            name: "Posts",
            children: [
              {
                path: "",
                element: <Posts />,
              },
              {
                path: "create",
                element: <Editor />,
                name: "Create Post",
              },
              {
                path: "update/:id",
                element: <Editor />,
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
