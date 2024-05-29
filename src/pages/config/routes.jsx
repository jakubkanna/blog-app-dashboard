import App from "../../App.jsx";
import Posts from "../Posts.jsx";
import Login from "../Login.jsx";
import Settings from "../Settings.jsx";
import Comments from "../Comments.jsx";

const SettingsRoute = {
  path: "settings",
  element: <Settings />,
};

export const UnprotectedPath = [
  {
    path: "/",
    element: <Login />,
  },
];

export const UserPath = [
  {
    path: "/user",
    element: <App />,
    children: [SettingsRoute],
  },
];

export const AdminPath = [
  {
    path: "/admin",
    element: <App />,
    children: [
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "comments",
        element: <Comments />,
      },
      SettingsRoute,
    ],
  },
];
