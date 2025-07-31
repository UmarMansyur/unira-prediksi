<template>
  <div class="card">
    <div class="card-header">
      <slot name="button2"></slot>
      <div
        class="d-flex align-items-center justify-content-between flex-wrap row-gap-3"
      >
        <Search :search="search" :set-search="setSearch"></Search>
        <div
          class="d-flex col-md-10 justify-content-md-end justify-content-center gap-2"
        >
          <div>
            <slot name="button"></slot>
          </div>
          <div>
            <Limit :limit="limit" :set-limit="setLimit"></Limit>
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead class="bg-light-subtle">
          <tr>
            <th v-for="(col, index) in columns" :key="index">
              <div
                class="cursor-pointer"
                :class="
                  col.sort
                    ? 'd-flex align-items-center mb-0 ' + col?.className
                    : ''
                "
                @click="handleSort(col?.sort)"
                v-if="col?.sort"
              >
                <p :class="col?.className + ' mb-0'">{{ col?.label }}</p>
                <span v-if="col?.sort">
                  <i
                    :class="`ms-3 ti ti-chevron-${isAsc ? 'up' : 'down'}`"
                    v-if="sort === col?.sort"
                  ></i>
                  <i class="ti ti-selector ms-2 fs-16" v-else></i>
                </span>
              </div>
              <div v-else :class="col?.className">{{ col?.label }}</div>
            </th>
          </tr>
        </thead>
        <tbody v-if="!isLoading" class="align-middle">
          <slot></slot>
          <tr v-if="totalData === 0 && !isLoading">
            <td :colspan="columns.length" class="text-center bg-">
              <div
                class="d-flex flex-column align-items-center justify-content-center gap-2"
              >
                <!-- <img src="/assets/img/empty-box.webp" alt="empty-box" class="opacity-50" width="200px" /> -->
                <p class="fw-semibold text-muted">Data tidak ditemukan</p>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="align-middle">
          <tr v-for="index in limit" :key="index">
            <td v-for="(_col, index) in columns" :key="index">
              <div class="skeleton skeleton-text mb-0"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      v-if="totalData > 0 && !isLoading"
      :page="page"
      :totalPage="totalPage"
      :startData="startData"
      :endData="endData"
      :totalData="totalData"
      :nextPage="nextPage"
      :prevPage="prevPage"
      :set-page="setPage"
    >
    </Pagination>
    <!-- buat paginate skeleton -->
    <div v-else-if="isLoading" class="d-flex justify-content-between gap-2 p-3">
      <div class="d-flex align-items-center gap-2">
        <div
          class="skeleton"
          style="width: 10rem; height: 1.2rem; margin-right: 0.5rem"
        ></div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div
          class="skeleton"
          style="width: 10rem; height: 1.2rem; margin-right: 0.5rem"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Limit from "./Limit.vue";
import Pagination from "./Pagination.vue";
import Search from "./Search.vue";

const {
  isLoading,
  columns,
  search,
  endData,
  limit,
  nextPage,
  page,
  prevPage,
  setLimit,
  setPage,
  setSearch,
  setSort,
  sort,
  startData,
  totalData,
  totalPage,
} = defineProps<{
  isLoading: boolean;
  columns: { key: string; label: string; sort?: string; className?: string }[];
  search: string;
  page: number;
  totalPage: number;
  startData: number;
  endData: number;
  totalData: number;
  setSort: (field: string, order?: string) => void;
  sort: string;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  limit: number;
  nextPage: () => void;
  prevPage: () => void;
}>();

const isAsc = ref(true);

const handleSort = (key: string) => {
  isAsc.value = !isAsc.value;
  const sort = isAsc.value ? "asc" : "desc";
  setSort(key, sort);
};
</script>
