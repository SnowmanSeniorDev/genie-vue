import { createRouter, createWebHistory } from "vue-router";
// import { createRouter } from "vue-router";
import SideMenu from "../layouts/Main.vue";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ValidatePhoneNumber from "../views/auth/ValidatePhoneNumber.vue";
import ForgotPassword from "../views/auth/ForgotPassword.vue";
import UpdatePassword from "../views/auth/UpdatePassword.vue";
import ResetPassword from "../views/auth/ResetPassword.vue";
import Users from "../views/users/index.vue";
import UsersList from "../views/users/UsersList.vue";
import CreatUser from "../views/users/Add.vue";
import UpdateUser from "../views/users/Edit.vue";
import NewUsers from "../views/users/NewUsers.vue";
import Permission from "../views/permissions/index.vue";
import PermissionList from "../views/permissions/PermissionList.vue";
import CreatePermission from "../views/permissions/Add.vue";
import EditPermission from "../views/permissions/Edit.vue";

import Company from "../views/companies/index.vue";
import CompanyDetail from "../views/companies/CompanyDetail.vue";
import Companies from "../views/companies/Companies.vue";

import RolesIndex from "../views/roles/index.vue";
import GrantAccess from "../views/roles/GrantAccess.vue";
import SettingsIndex from "../views/settings/index.vue";
import SystemConfigure from "../views/settings/SystemConfigure.vue";
import Account from "../views/account/index.vue";
import ProfileInformation from "../views/account/ProfileInformation.vue";
import CompanyInformation from "../views/account/CompanyInformation.vue";
import BankInformation from "../views/account/BankInformation.vue";
import CurrencySettings from "../views/account/CurrencySettings.vue";
import Kyc from "../views/account/Kyc.vue";
import Holidays from "../views/account/Holidays.vue";
import CompanyOnboard from "../views/onboard/index.vue";
import Invoice from "../views/invoice/index.vue";
import InvoiceDetail from "../views/invoice/invoiceDetail"
import DashboardOverview1 from "../views/dashboard/index.vue";
import ErrorPage from "../views/error-page/Error.vue";
import AccessDenied from "../views/error-page/AccessDenied.vue";
import Alerts from "../views/alerts/index.vue";
import Eco from "../views/eco/index.vue";
import Relationship from "../views/eco/Relationship.vue";
import Workflow from "../views/eco/Workflow.vue";
import { auth } from "../middleware/auth";
import { log } from "../middleware/log";

const routes = [
  {
    path: "",
    component: SideMenu,
    children: [
      {
        path: "",
        name: "GENIE_DASHBOARD",
        component: DashboardOverview1,
        meta: {
          permission: "GENIE_DASHBOARD"
        }
      }, {
        path: "/update_password",
        name: "updatePassword",
        component: UpdatePassword
      }, {
        path: "users",
        component: Users,
        children: [{
          path: "",
          name: "GENIE_USERS",
          component: UsersList
        }, {
          path: "creat",
          component: CreatUser,
        }, {
          path: "edit/:id",
          component: UpdateUser,
        }, {
          path: "new-users",
          name: "GENIE_USERS_ASSIGN_ROLE",
          component: NewUsers,
        }],
        meta: {
          permission: "GENIE_USERS"
        }
      }, {
        path: "permission",
        component: Permission,
        children: [{
          path: "",
          name: "GENIE_PERMISSION",
          component: PermissionList
        }, {
          path: "add",
          component: CreatePermission
        }, {
          path: "edit/:permissionId",
          component: EditPermission
        }],
        meta: {
          permission: "GENIE_PERMISSION"
        }
      }, {
        path: "roles",
        component: RolesIndex,
        children: [{
          path: "",
          name: "GENIE_USERS_ROLES",
          component: GrantAccess
        }],
        meta: {
          permission: "GENIE_USERS_ROLES"
        }
      }, {
        path: "companies",
        component: Company,
        children: [{
          path: "",
          name: "GENIE_COMPANIES",
          component: Companies
        }, {
          path: ":companyId",
          component: CompanyDetail,
          name: 'company-detail'
        }],
        meta: {
          permission: "GENIE_ADMIN_COMPANIES"
        }
      }, {
        path: "settings",
        component: SettingsIndex,
        children: [{
          path: "",
          name: "GENIE_SYSTEM_CONFIG",
          component: SystemConfigure
        }],
        meta: {
          permission: "GENIE_SYSTEM_CONFIG"
        }
      }, {
        path: "account",
        component: Account,
        children: [{
          path: "",
          component: CompanyInformation,
          name: "GENIE_COMPANY_PROFILE",
        }, {
          path: "bank-information",
          component: BankInformation
        },{
          path: "profile-information",
          component: ProfileInformation
        }, {
          path: "currency-settings",
          component: CurrencySettings
        }, {
          path: "kyc",
          component: Kyc
        }, {
          path: "holidays",
          component: Holidays
        }],
        meta: {
          permission: "GENIE_COMPANY_PROFILE"
        }
      }, {
        path: "company-onboard",
        name: "COMPANY_ONBOARD",
        component: CompanyOnboard
      }, {
        path: "invoice",
        name: "GENIE_INVOICE",
        component: Invoice
      }, {
        path: "invoice/detail/:workflowExecutionReferenceId",
        name: "batchDetail",
        component: InvoiceDetail,
        props: true
      }, {
        path: "alerts",
        component: Alerts,
      }, {
        path: "eco",
        component: Eco,
        children: [{
          path: "",
          component: Relationship,
          name: "GENIE_ECO_RELASHIONSHIP",
        }, {
          path: "workflow",
          component: Workflow,
          name: "GENIE_ECO_WORKFLOW"
        }],
        meta: {
          permission: "GENIE_ECO_SYSTEM"
        }
      },
    ],
    meta: {
      middleware: [auth, log],
    }
  }, {
    path: "/login",
    name: "login",
    component: Login,
  }, {
    path: "/register",
    name: "register",
    component: Register,
  }, {
    path: "/validate-phone-number",
    name: "validatePhoneNumber",
    component: ValidatePhoneNumber,
  }, {
    path: "/forgot_password",
    name: "forgotPassword",
    component: ForgotPassword,
  }, {
    path: "/reset_password/:checkValidity",
    name: "resetPassword",
    component: ResetPassword,
  }, {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  }, {
    path: "/access-denide",
    name: "GENIE_ACCESS_DENIED",
    component: AccessDenied,
  }, {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
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
