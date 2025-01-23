import { createWebHistory, createRouter } from "vue-router";
import OrderPage from "@/views/OrderPage.vue";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ProductPage from "@/views/ProductPage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";
import EditPage from "@/views/EditPage.vue";
import SettingsPage from "@/views/SettingsPage.vue";

const routes = [
  {
    path: "/orderpage",
    name: "OrderPage",
    component: OrderPage,
  },
  {
    path: "/homepage",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/loginpage",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/registerpage",
    name: "RegisterPage",
    component: RegisterPage,
  },
  {
    path: "/productpage/:productId",
    name: "ProductPage",
    component: ProductPage,
    props: true, // Pass route params as props to the component
  },
  {
    path: "/editpage/:productId",
    name: "EditPage",
    component: EditPage,
    props: true, // Pass route params as props to the component
  },
  {
    path: "/checkoutpage",
    name: "CheckoutPage",
    component: CheckoutPage,
  },
  {
    path: "/settingspage",
    name: "SettingsPage",
    component: SettingsPage,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.fullPath.includes('/src/')) {
    const cleanedPath = to.fullPath.replace(/\/src(\/|$)/g, '/');
    next(cleanedPath);
  } else {
    next();
  }
});

export default router;
