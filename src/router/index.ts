import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { sessionStore } from "../stores";
import useToken from "../composables/token";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    meta: {
      is_auth: false,
      title: "Home",
    },
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/administrator/dashboard/Index.vue"),
    meta: {
      is_auth: true,
      title: "Dashboard",
    },
    beforeEnter: (_to, _from, next) => {
      const session = sessionStore();
      console.log(session);
      if (session.user?.role !== "Administrator") {
        next({ name: "Dashboard Dosen" });
      } else {
        next();
      }
    }
  },
  {
    path: '/dashboard-dosen',
    name: 'Dashboard Dosen',
    component: () => import("../views/dosen/dashboard/Index.vue"),
    meta: {
      is_auth: true,
      title: "Dashboard Dosen",
    },
  },
  {
    path: "/dataset",
    name: "Dataset",
    meta: {
      is_auth: true,
      title: "Dataset",
    },
    component: () => import("../views/administrator/dataset/Index.vue"),
  },
  {
    path: "/setting-params",
    name: "SettingParams",
    meta: {
      is_auth: true,
      title: "Setting Parameters",
    },
    component: () => import("../views/administrator/setting-params/Index.vue"),
  },
  {
    path: "/rules",
    name: "Rules",
    meta: {
      is_auth: true,
      title: "Rules",
    },
    component: () => import("../views/administrator/rules/Index.vue"),
  },
  {
    path: "/dataset-train",
    name: "Dataset Train",
    meta: {
      is_auth: true,
      title: "Dataset Train",
    },
    component: () => import("../views/administrator/dataset-train/Index.vue"),
  },
  {
    path: "/dataset-test",
    name: "Dataset Test",
    meta: {
      is_auth: true,
      title: "Dataset Test",
    },
    component: () => import("../views/administrator/dataset-test/Index.vue"),
  },
  {
    // data smote
    path: "/data-smote",
    name: "Data SMOTE",
    meta: {
      is_auth: true,
      title: "Data SMOTE",
    },
    component: () => import("../views/administrator/data-smote/Index.vue"),
  },
  {
    path: "/bootstrap",
    name: "Bootstrap",
    meta: {
      is_auth: true,
      title: "Bootstrap Sampling",
    },
    component: () => import("../views/administrator/bootstrap/Index.vue"),
  },
  {
    path: "/decision-tree",
    name: "DecisionTree",
    meta: {
      is_auth: true,
      title: "Decision Tree",
    },
    component: () => import("../views/administrator/decision-tree/Index.vue"),
  },
  {
    path: "/evaluation",
    name: "Evaluation",
    meta: {
      is_auth: true,
      title: "Evaluation",
    },
    component: () => import("../views/administrator/evaluation/Index.vue"),
  },
  // data hasil klasifikasi
  {
    path: "/data-hasil-klasifikasi",
    name: "Data Hasil Klasifikasi",
    meta: {
      is_auth: true,
      title: "Data Hasil Klasifikasi",
    },
    component: () => import("../views/administrator/predict/Index.vue"),
  },
  {
    path: "/riwayat-predict",
    name: "Riwayat Predict",
    meta: {
      is_auth: true,
      title: "Riwayat Predict",
    },
    component: () => import("../views/administrator/predict/riwayat/Index.vue"),
  },
  {
    // users
    path: "/users",
    name: "Users",
    meta: {
      is_auth: true,
      title: "Users",
    },
    component: () => import("../views/administrator/users/Index.vue"),
  },
  // DOsen
  // Bimbingan
  {
    path: '/data-bimbingan',
    name: 'Data Bimbingan',
    meta: {
      is_auth: true,
      title: 'Data Bimbingan',
    },
    component: () => import("../views/dosen/bimbingan/Index.vue"),
  },
  // Data Hasil Klasifikasi Dosen
   {
    path: "/data-klasifikasi",
    name: "Data Klasifikasi Tren IPS",
    meta: {
      is_auth: true,
      title: "Data Klasifikasi Tren IPS",
    },
    component: () => import("../views/dosen/data-klasifikasi/Index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "active",
});

router.beforeEach(async (to: any, _from, next) => {
  if(!to.meta.is_auth) {
    next();
    return;
  }

  if(sessionStorage.getItem("token") === null) {
    next({ name: "Home" });
    return;
  }


  const session = sessionStore();
  const { decodeToken } = useToken();
  if (session.user == null) {
    await decodeToken();
  }
  document.title = to.meta.title || "Unira Prediksi";
  next();
});

export default router;
