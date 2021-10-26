export default [
  {
    path: "/dashboard",
    name: "dashboard",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/Dashboard"),
  },
  {
    path: "/locales",
    name: "local_list",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/local/LocalList"),
  },
  {
    path: "/locales/:id",
    name: "local_detail",
    meta: {
      authRequired: true,
    },
    component: () => import("../views/local/LocalDetail"),
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login"),
  },
  {
    path: "/404",
    name: "404",
    component: require("./views/utility/404").default,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: "*",
    redirect: "404",
  },
]
