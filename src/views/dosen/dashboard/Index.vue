<script setup lang="ts">
import BreadCrumb from "../../../components/BreadCrumb.vue";
import { sessionStore } from "../../../stores";
import Home from "../../layouts/Home.vue";
const session = sessionStore();
</script>

<template>
  <Home>
    <BreadCrumb title="Dashboard" subtitle="Administrator" />
    <div class="card">
      <div class="card-body">
        <span class="badge bg-primary mb-0 rounded-pill">AKTIF</span>
        <h1 class="fs-4 mb-0">{{ session?.user?.role === 'Administrator' ? 'Administrator' : session.user?.id }}</h1>
        <p class="fw-bold fs-3 mb-0">{{ session?.user?.username }}</p>
      </div>
    </div>
  </Home>
</template>
