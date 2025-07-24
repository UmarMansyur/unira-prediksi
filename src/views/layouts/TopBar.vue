<template>
  <!-- Brand Logo -->
  <a href="index.html" class="logo">
    <span class="logo-light">
      <div class="d-flex">
        <span class="logo-lg"
          ><img src="https://pmb.unira.ac.id/img/unira.png" alt="logo"
        /></span>
        <span class="text-white fs-6 fw-bold ms-1" id="logo-text-2">
          UNIRA - Random Forest Tren IPS
        </span>
      </div>
      <span class="logo-sm"
        ><img src="https://pmb.unira.ac.id/img/unira.png" alt="small logo"
      /></span>
    </span>

    <span class="logo-dark">
      <span class="logo-lg"
        ><img src="https://pmb.unira.ac.id/img/unira.png" alt="dark logo"
      /></span>
      <span class="logo-sm"
        ><img src="https://pmb.unira.ac.id/img/unira.png" alt="small logo"
      /></span>
    </span>
  </a>

  <!-- Sidebar Hover Menu Toggle Button -->
  <button class="button-sm-hover" type="button" @click="toggleSidebar">
    <i class="ti ti-circle align-middle"></i>
  </button>
</template>

<script setup lang="ts">
const toggleSidebar = () => {
  const body = document.body;
  body.classList.toggle('sidebar-enable');
  if(body.classList.contains('sidebar-enable')) {
    body.classList.add('vertical-collapsed');
  } else {
    body.classList.remove('vertical-collapsed');
  }
};
</script>