import { r as reactExports, U as jsxRuntimeExports, _ as Outlet } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, a as useNavigate } from "./router-C2dGhf-y.js";
import { D as DashboardSidebar } from "./DashboardSidebar-BiXSe1Qy.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./cosumar-logo-BFmipKES.js";
import "./createLucideIcon-DlByY22N.js";
import "./users-b0TKxeqs.js";
import "./chart-column-Cz9F7Ik0.js";
import "./credit-card-T9hW7jbN.js";
import "./calendar-BWcmQtxU.js";
import "./bell-B6zrSvJq.js";
import "./truck-CzO1vvbx.js";
import "./shield-D7bPpCZF.js";
import "./log-out-DVMrXd0D.js";
function EmployeLayout() {
  const {
    user,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isLoading && (!user || user.role !== "employe")) {
      navigate({
        to: "/auth/login",
        search: {
          role: "employe"
        }
      });
    }
  }, [user, isLoading, navigate]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  if (!user || user.role !== "employe") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-6 lg:p-8 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  EmployeLayout as component
};
