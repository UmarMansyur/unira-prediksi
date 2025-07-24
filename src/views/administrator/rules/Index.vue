<script setup lang="ts">
import Parent from "../../layouts/Home.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import usePagination from "../../../composables/pagination";
import { ref } from "vue";
import DataTable from "../../../components/DataTable.vue";
import useAPI from "../../../composables/api";
import { toast } from "vue3-toastify";

const {
  data,
  setSearch,
  search,
  setPage,
  page,
  totalPage,
  nextPage,
  prevPage,
  startData,
  endData,
  totalData,
  setLimit,
  limit,
  isLoading,
  setSorting,
  sortBy,
  setFilter,
} = usePagination(["rules"], "/rule");

const { getResource } = useAPI();
const prodi = ref<any[]>([]);

const loadProdi = async () => {
  const response = await getResource("/prodi");
  if (response?.data) {
    prodi.value = response.data;
  } else {
    toast.error("Failed to load prodi data: " + response.message);
  }
};

const selectedProdi = ref<string>("");
const setProdi = (prodiId: string) => {
  selectedProdi.value = prodiId;
  setFilter("prodi=" + prodiId);
};

loadProdi();
</script>

<template>
  <Parent>
    <BreadCrumb title="Data Rules" subtitle="Administrator" />
    <DataTable
      :data="data"
      :setSearch="setSearch"
      :search="search"
      :setPage="setPage"
      :page="page"
      :totalPage="totalPage"
      :nextPage="nextPage"
      :prevPage="prevPage"
      :startData="startData"
      :endData="endData"
      :totalData="totalData"
      :setLimit="setLimit"
      :limit="limit"
      :columns="[
        { key: 'parent_id', label: 'Parent', sort: 'parent_id' },
        { key: 'position', label: 'Position', sort: 'position' },
        { key: 'threshold', label: 'Threshold', sort: 'threshold' },
        { key: 'field', label: 'Field', sort: 'field' },
        { key: 'depth', label: 'Depth', sort: 'depth' },
        { key: 'estimator', label: 'Estimator', sort: 'estimator' },
        { key: 'prodi', label: 'Prodi', sort: 'prodi' },
      ]"
      :is-loading="isLoading"
      :sort="sortBy"
      :set-sort="setSorting"
    >
      <tr v-for="(item, index) in data" :key="index">
        <td>{{ item.parent_id }}</td>
        <td>{{ item.position }}</td>
        <td>{{ item.threshold }}</td>
        <td>{{ item.field }}</td>
        <td>{{ item.depth }}</td>
        <td>{{ item.estimator }}</td>
        <td>{{ item.prodi }}</td>
      </tr>
      <template #button>
        <!-- select prodi -->
        <select
          class="form-select"
          v-model="selectedProdi"
          @change="setProdi(selectedProdi)"
        >
          <option value="">PILIH PROGRAM STUDI</option>
          <option v-for="item in prodi" :key="item.id" :value="item.id">
            {{ `${item.id} - (${item.nama})` }}
          </option>
        </select>
      </template>
    </DataTable>
  </Parent>
</template>

<style scoped lang="css"></style>
