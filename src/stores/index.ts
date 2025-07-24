import { defineStore } from "pinia";

export const sessionStore = defineStore("session", {
  state: () => ({
    token: null as string | null,
    user: null as any | null,
    active_role: null as string | null,
    toast: null as string | null,
    isAuth: false,
  }),
  actions: {
    setToken(token: string | null) {
      this.token = token;
      this.isAuth = !!token;
    },
    setUser(user: any | null) {
      this.user = user;
    },
    setToast(toast: string | null) {
      this.toast = toast;
    },
    setActiveRole(role: string | null) {
      this.active_role = role;
      sessionStorage.setItem("role", role || "");
    },
    logout() {
      this.token = null;
      this.user = null;
      this.isAuth = false;
      this.active_role = null;
      this.toast = null;
    },
  },
});