import { toast } from "vue3-toastify";
import useApi from "./api";
import { ref } from "vue";
import { sessionStore } from "../stores";
const { getResource, postResource } = useApi();

export default function useToken() {
  const session = sessionStore();
  const isAdmin = ref<Boolean>(false);

  async function setToken(token: any) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  function getAccessToken() {
    if (sessionStorage.getItem("token")) {
      return JSON.parse(sessionStorage.getItem("token")!);
    }
    return "";
  }

  async function clearToken() {
    sessionStorage.clear();
  }

  async function decodeToken() {
    try {
      const response = await getResource("/auth/saya", true);
      checkRole(response.data?.role);
      session.setUser(response?.data);
      return await response.data;
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function checkRole(role: string) {
    if (role === "Administrator") {
      isAdmin.value = true;
      return;
    }
    isAdmin.value = false;
  }

  async function validateToken() {
    try {
      const payload = JSON.parse(window.atob(getAccessToken()!.split(".")[1]));
      const expired = payload.exp;
      const now = Date.now() / 1000;
      if (now > expired) {
        await refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function refresh() {
    try {
      const response = await postResource(
        "/auth/refresh",
        {
          token_refresh: getAccessToken().token_refresh,
        },
        true
      );
      await setToken(response.data.token_access);
      await decodeToken();
      return;
    } catch (error: any) {
      clearToken();
      toast.error(error.message);
    }
  }

  return {
    setToken,
    clearToken,
    decodeToken,
    getAccessToken,
    validateToken,
    isAdmin,
    refresh,
  };
}
