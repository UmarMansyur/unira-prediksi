<template>
  <div class="page-container">
    <div class="page-title-head d-flex align-items-center gap-2">
      <div class="flex-grow-1">
        <h4 class="fs-16 text-uppercase fw-bold mb-0">{{ props.title }}</h4>
      </div>

      <div class="text-end">
        <ol class="breadcrumb m-0 py-0 fs-13">
          <li class="breadcrumb-item">
            <a href="javascript: void(0);">
              {{ props.subtitle || 'Dashboard' }}
            </a>
          </li>

          <li class="breadcrumb-item active">{{ props.title }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
