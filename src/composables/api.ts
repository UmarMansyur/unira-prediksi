import { toast } from "vue3-toastify";
import {jwtDecode} from "jwt-decode";
export default function useAPI() {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";


  async function fetchAPI(
    endpoint: string,
    options: RequestInit = {},
    isAuth: boolean = false,
    isFormData: boolean = false
  ) {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (isAuth) {
        let token: any = JSON.parse(sessionStorage.getItem("token") || "{}");
        if (!token || !token.token_access) {
        } else {
          const payload = jwtDecode(token.token_access);
          const expired: any = payload.exp;
          const now = Date.now() / 1000;
          if (now > expired) {
            const response = await fetch(`${baseURL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token_refresh: token.token_refresh || "",
              }),
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(
                data.message ? data.message : data.error || "An error occurred"
              );
            }
            sessionStorage.setItem("token", JSON.stringify(data?.data));
            token = data?.data;
          }
          headers["Authorization"] = `Bearer ${token.token_access}`;
        }
      }

      if (isFormData) {
        delete headers["Content-Type"];
        const formData = new FormData();
        if (options.body) {
          const body = options.body as Record<string, any>;
          for (const key in body) {
            if (body[key] instanceof File) {
              formData.append(key, body[key]);
            } else if (typeof body[key] === "object") {
              formData.append(key, JSON.stringify(body[key]));
            } else {
              formData.append(key, body[key]);
            }
          }
        }
        options.body = formData;
      } else {
        if (options.body) {
          options.body = JSON.stringify(options.body);
        }
      }

      const response = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ? data.message : data.error || "An error occurred"
        );
      }

      return data;
    } catch (error: any) {
      document.getElementById("layer")!.style.display = "none";
      toast.error(error.message || "An error occurred while fetching data.");
    }
  }

  async function getResource(endpoint: string, isAuth: boolean = false) {
    return fetchAPI(endpoint, { method: "GET" }, isAuth);
  }

  async function postResource(
    endpoint: string,
    data: any,
    isAuth: boolean = false,
    isFormData: boolean = false
  ) {
    document.getElementById("layer")!.style.display = "flex";
    const response = await fetchAPI(
      endpoint,
      { method: "POST", body: data },
      isAuth,
      isFormData
    );
    document.getElementById("layer")!.style.display = "none";
    return response;
  }

  async function putResource(
    endpoint: string,
    data: any,
    isAuth: boolean = false,
    isFormData: boolean = false
  ) {
    document.getElementById("layer")!.style.display = "flex";
    const response = await fetchAPI(
      endpoint,
      { method: "PUT", body: data },
      isAuth,
      isFormData
    );
    document.getElementById("layer")!.style.display = "none";
    return response;
  }

  async function deleteResource(endpoint: string, isAuth: boolean = false) {
    document.getElementById("layer")!.style.display = "flex";
    const response = await fetchAPI(endpoint, { method: "DELETE" }, isAuth);
    document.getElementById("layer")!.style.display = "none";
    return response;
  }

  async function patchResource(
    endpoint: string,
    data: any,
    isAuth: boolean = false,
    isFormData: boolean = false
  ) {
    // document.getElementById("layer")!.style.display = "flex";
    const response = await fetchAPI(
      endpoint,
      { method: "PATCH", body: data },
      isAuth,
      isFormData
    );
    // document.getElementById("layer")!.style.display = "none";
    return response;
  }

  return {
    getResource,
    postResource,
    putResource,
    deleteResource,
    baseURL,
    patchResource
  };
}