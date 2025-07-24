<script setup lang="ts">
import Parent from "../../layouts/Home.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import usePagination from "../../../composables/pagination";
import DataTable from "../../../components/DataTable.vue";
import useAPI from "../../../composables/api";
import { ref } from "vue";
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
} = usePagination(["evaluation"], "/evaluation?type=OVERALL");

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
    <BreadCrumb title="Data Evaluasi" subtitle="Administrator" />
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
        { key: 'prodi', label: 'Prodi', sort: 'prodi' },
        { key: 'precision', label: 'Precision', sort: 'precision' },
        { key: 'recall', label: 'Recall', sort: 'recall' },
        { key: 'accuracy', label: 'Akurasi', sort: 'accuracy' },
        { key: 'f1_score', label: 'F1 Score', sort: 'f1_score' },
        { key: 'tp', label: 'TP', sort: 'tp' },
        { key: 'tn', label: 'TN', sort: 'tn' },
        { key: 'fp', label: 'FP', sort: 'fp' },
        { key: 'fn', label: 'FN', sort: 'fn' },
      ]"
      :is-loading="isLoading"
      :sort="sortBy"
      :set-sort="setSorting"
    >
      <tr v-for="(item, index) in data" :key="index">
        <td>{{ item.prodi }}</td>
        <td>{{ Math.round(item.precision * 100) / 100 }}</td>
        <td>{{ Math.round(item.recall * 100) / 100 }}</td>
        <td>{{ Math.round(item.accuracy * 100) / 100 }}</td>
        <td>{{ Math.round(item.f1_score * 100) / 100 }}</td>
        <td>{{ Math.round(item.tp * 100) / 100 }}</td>
        <td>{{ Math.round(item.tn * 100) / 100 }}</td>
        <td>{{ Math.round(item.fp * 100) / 100 }}</td>
        <td>{{ Math.round(item.fn * 100) / 100 }}</td>
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
