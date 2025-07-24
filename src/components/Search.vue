<template>
  <div class="flex-shrink-0 d-flex align-items-center gap-2 col-md-auto">
    <div class="position-relative">
      <input
        type="text"
        class="form-control ps-4"
        placeholder="Masukkan kata kunci..."
        v-model="search"
        @input="setSearch(search)"
      /><i
        class="ti ti-search position-absolute top-50 translate-middle-y start-0 ms-2"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { setSearch, search: s } = defineProps({
  setSearch: {
    type: Function,
    required: true,
  },
  search: {
    type: String,
    default: "",
  },
});
const search = ref(s);
</script>
