import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/Main.vue";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ErrorPage from "../views/error-page/Main.vue";
import DashboardOverview1 from "../views/dashboard/index.vue";
import { auth } from "../middleware/auth"
import { log } from "../middleware/log"

const routes = [
  {
    path: "/",
    component: SideMenu,
    children: [
      {
        path: "/",
        name: "side-menu-dashboard-overview-1",
        component: DashboardOverview1
      }
    ],
    meta: {
      middleware: [auth, log],
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      middleware: log,
    }
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      middleware: log,
    }
  },
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
    meta: {
      middleware: log,
    }
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
    meta: {
      middleware: log,
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  }
});


// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
const nextFactory = (context, middleware, index) => {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];

    const context = { from, next, router, to };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
