<template>
  <div data-simplebar>
    <!--- Sidenav Menu -->
    <ul class="side-nav">
      <li class="text-center d-flex flex-column align-items-center">
        <div
          class="border d-flex justify-content-center rounded-circle mb-2 overflow-hidden"
          style="width: 100px; height: 100px"
          id="thumbnail-sidebar"
        >
          <img
            :src="session?.user?.thumbnail"
            alt="logo"
            class="rounded-circle"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </div>
        <div id="text-sidebar" class="text-center">
          <h5 class="mb-0">{{ session?.user?.username || "User" }}</h5>
          <p class="text-muted mb-0 text-capitalize">
            {{ session?.user?.role || "Role" }}
          </p>
        </div>
      </li>
      <li class="side-nav-title">Menu</li>

      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Dashboard' }"
      >
        <RouterLink
          to="/dashboard"
          class="side-nav-link"
          :class="{ active: $route.name === 'Dashboard' }"
        >
          <span class="menu-icon"><i class="ti ti-home"></i></span>
          <span class="menu-text"> Beranda </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Dataset' }"
      >
        <RouterLink
          to="/dataset"
          class="side-nav-link"
          :class="{ active: $route.name === 'Dataset' }"
        >
          <span class="menu-icon"><i class="ti ti-file"></i></span>
          <span class="menu-text"> Data Mahasiswa </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Dataset Train' }"
      >
        <RouterLink
          to="/dataset-train"
          class="side-nav-link"
          :class="{ active: $route.name === 'Dataset Train' }"
        >
          <span class="menu-icon"><i class="ti ti-edit"></i></span>
          <span class="menu-text"> Data Latih </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Dataset Test' }"
      >
        <RouterLink
          to="/dataset-test"
          class="side-nav-link"
          :class="{ active: $route.name === 'Dataset Test' }"
        >
          <span class="menu-icon"><i class="ti ti-sandbox"></i></span>
          <span class="menu-text"> Data Uji </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Data SMOTE' }"
      >
        <RouterLink
          to="/data-smote"
          class="side-nav-link"
          :class="{ active: $route.name === 'Data SMOTE' }"
        >
          <span class="menu-icon"><i class="ti ti-share"></i></span>
          <span class="menu-text"> Data SMOTE </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Bootstrap' }"
      >
        <RouterLink
          to="/bootstrap"
          class="side-nav-link"
          :class="{ active: $route.name === 'Bootstrap' }"
        >
          <span class="menu-icon"><i class="ti ti-zoom-question"></i></span>
          <span class="menu-text"> Bootstrap Sampling </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Rules' }"
      >
        <RouterLink
          to="/rules"
          class="side-nav-link"
          :class="{ active: $route.name === 'Rules' }"
        >
          <span class="menu-icon"><i class="ti ti-command"></i></span>
          <span class="menu-text"> Data Rules </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'DecisionTree' }"
      >
        <RouterLink
          to="/decision-tree"
          class="side-nav-link"
          :class="{ active: $route.name === 'DecisionTree' }"
        >
          <span class="menu-icon"><i class="ti ti-hierarchy"></i></span>
          <span class="menu-text"> Pohon Keputusan </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Data Hasil Klasifikasi' }"
      >
        <RouterLink
          to="/data-hasil-klasifikasi"
          class="side-nav-link"
          :class="{ active: $route.name === 'Data Hasil Klasifikasi' }"
        >
          <span class="menu-icon"><i class="ti ti-presentation"></i></span>
          <span class="menu-text"> Data Hasil Klasifikasi </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Evaluation' }"
      >
        <RouterLink
          to="/evaluation"
          class="side-nav-link"
          :class="{ active: $route.name === 'Evaluation' }"
        >
          <span class="menu-icon"><i class="ti ti-flask-2"></i></span>
          <span class="menu-text"> Evaluasi </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'Administrator'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Users' }"
      >
        <RouterLink
          to="/users"
          class="side-nav-link"
          :class="{ active: $route.name === 'Users' }"
        >
          <span class="menu-icon"><i class="ti ti-users"></i></span>
          <span class="menu-text"> Data Pengguna </span>
        </RouterLink>
      </li>

      <!-- Dosen -->
      <li
        v-if="session?.user?.role === 'dosen'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Dashboard' }"
      >
        <RouterLink
          to="/dashboard"
          class="side-nav-link"
          :class="{ active: $route.name === 'Dashboard' }"
        >
          <span class="menu-icon"><i class="ti ti-home"></i></span>
          <span class="menu-text"> Beranda </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'dosen'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Data Bimbingan' }"
      >
        <RouterLink
          to="/data-bimbingan"
          class="side-nav-link"
          :class="{ active: $route.name === 'Data Bimbingan' }"
        >
          <span class="menu-icon"><i class="ti ti-users"></i></span>
          <span class="menu-text"> Data Bimbingan </span>
        </RouterLink>
      </li>
      <li
        v-if="session?.user?.role === 'dosen'"
        class="side-nav-item"
        :class="{ active: $route.name === 'Data Klasifikasi Tren IPS' }"
      >
        <RouterLink
          to="/data-klasifikasi"
          class="side-nav-link"
          :class="{ active: $route.name === 'Data Klasifikasi Tren IPS' }"
        >
          <span class="menu-icon"><i class="ti ti-chart-line"></i></span>
          <span class="menu-text"> Data Hasil Klasifikasi </span>
        </RouterLink>
      </li>
    </ul>
    <div class="clearfix"></div>
  </div>
</template>

<script setup lang="ts">
import { sessionStore } from "../../stores";

const session = sessionStore();
</script>
