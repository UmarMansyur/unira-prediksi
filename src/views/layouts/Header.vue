<template>
  <header class="app-topbar">
    <div class="page-container topbar-menu">
      <div class="d-flex align-items-center gap-2">
        <!-- Brand Logo -->
        <a href="index.html" class="logo">
          <span class="logo-light">
            <span class="logo-lg"
              ><img src="/assets/images/logo.png" alt="logo"
            /></span>
            <span class="logo-sm"
              ><img src="/assets/images/logo-sm.png" alt="small logo"
            /></span>
          </span>

          <span class="logo-dark">
            <span class="logo-lg"
              ><img src="/assets/images/logo-dark.png" alt="dark logo"
            /></span>
            <span class="logo-sm"
              ><img src="/assets/images/logo-sm.png" alt="small logo"
            /></span>
          </span>
        </a>

        <!-- Sidebar Menu Toggle Button -->
        <button
          class="sidenav-toggle-button px-2"
          type="button"
          @click="toggleSidebar"
        >
          <i class="ti ti-menu-deep fs-24"></i>
        </button>

        <!-- Horizontal Menu Toggle Button -->
        <button
          class="topnav-toggle-button px-2"
          data-bs-toggle="collapse"
          data-bs-target="#topnav-menu-content"
        >
          <i class="ti ti-menu-deep fs-22"></i>
        </button>
      </div>

      <div class="d-flex align-items-center gap-2">
        <!-- Search for small devices -->
        <div class="topbar-item d-flex d-xl-none">
          <button
            class="topbar-link"
            data-bs-toggle="modal"
            data-bs-target="#searchModal"
            type="button"
          >
            <i class="ti ti-search fs-22"></i>
          </button>
        </div>

        <!-- Light/Dark Mode Button -->
        <div class="topbar-item d-none d-sm-flex">
          <button class="topbar-link" id="light-dark-mode" type="button" @click="tryLogout">
            <i class="ti ti-power fs-22"></i>
          </button>
        </div>

        <!-- User Dropdown -->
        <div class="topbar-item nav-user">
          <div class="dropdown">
            <a
              class="topbar-link dropdown-toggle drop-arrow-none px-2"
              type="button"
            >
            <div class="d-flex align-items-center justify-content-center overflow-hidden me-2" style="width: 40px; height: 40px;">
              <img
                :src="session.user?.thumbnail"
                width="32"
                class="rounded-circle d-flex border border-2 border-white"
                alt="user-image"
                style="object-fit: cover; width: 100%; height: 100%;"
              />
             
            </div>
              <span class="d-lg-flex flex-column gap-1 d-none">
                <h5 class="my-0">
                  {{ session?.user?.username || "User" }}
                </h5>
                <h6 class="my-0 fw-normal text-capitalize">
                  {{ session?.user?.role || "Role" }}
                </h6>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import router from "../../router";
import { sessionStore } from "../../stores";

const session = sessionStore();
const toggleSidebar = () => {
  // data-sidenav-size="default" classnya sidebar-enable toggle ya ada di html
  const htmlAttribute = document.documentElement;
  htmlAttribute.classList.toggle("sidebar-enable");
  if (htmlAttribute.classList.contains("sidebar-enable")) {
    htmlAttribute.setAttribute("data-sidenav-size", "condensed");
    document.getElementById("logo-text-2")?.classList.add("d-none");
    document.getElementById("thumbnail-sidebar")?.style.setProperty("width", "40px");
    document.getElementById("thumbnail-sidebar")?.style.setProperty("height", "40px");
    document.getElementById("text-sidebar")?.classList.add("d-none");
  } else {
    htmlAttribute.setAttribute("data-sidenav-size", "default");
    document.getElementById("logo-text-2")?.classList.remove("d-none");
    document.getElementById("thumbnail-sidebar")?.style.setProperty("width", "100px");
    document.getElementById("thumbnail-sidebar")?.style.setProperty("height", "100px");
    document.getElementById("text-sidebar")?.classList.remove("d-none");
  }
};


const tryLogout = async () => {
  try {
    sessionStorage.clear();
    session.$reset();
    router.push({ name: "Home" });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

</script>
